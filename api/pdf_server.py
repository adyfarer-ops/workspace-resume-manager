from flask import Flask, send_file, jsonify
import json
import os
import base64
import requests
from playwright.sync_api import sync_playwright
from PIL import Image
import io

app = Flask(__name__)

# 数据目录
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), '..', 'templates', 'resume-extended.html')

def load_data():
    """加载所有数据文件"""
    with open(os.path.join(DATA_DIR, 'profile.json'), 'r', encoding='utf-8') as f:
        profile = json.load(f)
    with open(os.path.join(DATA_DIR, 'skills.json'), 'r', encoding='utf-8') as f:
        skills = json.load(f)
    with open(os.path.join(DATA_DIR, 'experience.json'), 'r', encoding='utf-8') as f:
        experience = json.load(f)
    with open(os.path.join(DATA_DIR, 'projects.json'), 'r', encoding='utf-8') as f:
        projects = json.load(f)
    with open(os.path.join(DATA_DIR, 'education.json'), 'r', encoding='utf-8') as f:
        education = json.load(f)
    return profile, skills, experience, projects, education

def image_to_base64(url):
    """下载图片并转为base64"""
    try:
        if not url.startswith('http'):
            url = 'https://yfarer.cn' + url
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            ext = os.path.splitext(url)[1].lower()
            mime_type = 'image/png' if ext == '.png' else 'image/jpeg'
            return f"data:{mime_type};base64,{base64.b64encode(response.content).decode()}"
    except Exception as e:
        print(f"图片下载失败: {e}")
    return None

def prepare_template_data():
    """准备模板数据"""
    profile, skills, experience, projects, education = load_data()
    
    # 处理技能
    skill_categories = [{
        'title': cat['category'],
        'skills': [{'name': item} for item in cat['items']]
    } for cat in skills['skills']['technical']]
    
    # 处理项目
    processed_projects = []
    for proj in projects['projects']:
        sub_projects = None
        if proj.get('subProjects'):
            sub_projects = [{
                'title': sub['title'],
                'subtitle': sub.get('subtitle', ''),
                'description': sub['description'],
                'techStack': ', '.join(sub['techStack']) if sub.get('techStack') else None
            } for sub in proj['subProjects']]
        
        processed_projects.append({
            'name': proj['name'],
            'role': proj['role'],
            'period': proj['period'],
            'tags': proj.get('tags', []),
            'description': proj['description'][0] if isinstance(proj.get('description'), list) else proj.get('description'),
            'subProjects': sub_projects
        })
    
    # 处理工作经历
    processed_experiences = [{
        'company': exp['company'],
        'role': exp['position'],
        'period': exp['period'],
        'description': exp['description'],
        'achievements': exp.get('achievements', [])
    } for exp in experience['experiences']]
    
    # 处理头像
    avatar_base64 = image_to_base64(profile['avatar'])
    
    return {
        'name': profile['name'],
        'avatar': avatar_base64 or profile['avatar'],
        'title': profile['title'],
        'quote': profile['quote'],
        'age': profile['contact']['age'],
        'location': profile['contact']['location'],
        'phone': profile['contact']['phone'],
        'email': profile['contact']['email'],
        'about': profile['about'],
        'skillCategories': skill_categories,
        'projects': processed_projects,
        'experiences': processed_experiences,
        'education': education['education']
    }

def generate_html():
    """生成HTML"""
    from jinja2 import Template
    
    data = prepare_template_data()
    
    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    template = Template(template_content)
    return template.render(**data)

def generate_pdf():
    """使用Playwright生成PDF"""
    html_content = generate_html()
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        # 加载HTML
        page.set_content(html_content, wait_until='networkidle')
        page.wait_for_timeout(500)
        
        # 获取页面高度
        body_height = page.evaluate('() => document.body.scrollHeight')
        
        # 设置视口
        page.set_viewport_size({'width': 794, 'height': body_height})
        
        # 截图
        screenshot = page.screenshot(full_page=True, type='png')
        browser.close()
    
    # 转换为PDF
    image = Image.open(io.BytesIO(screenshot))
    
    # 计算PDF尺寸 (A4宽度595.28 points)
    pdf_width = 595.28
    pdf_height = (image.height / image.width) * pdf_width
    
    # 创建PDF
    pdf_buffer = io.BytesIO()
    image.save(pdf_buffer, format='PDF', resolution=100.0)
    pdf_buffer.seek(0)
    
    return pdf_buffer

@app.route('/api/resume/pdf')
def get_resume_pdf():
    """生成并返回简历PDF"""
    try:
        print("PDF请求 received")
        pdf_buffer = generate_pdf()
        print(f"PDF生成完成，大小: {pdf_buffer.getbuffer().nbytes}")
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=False,
            download_name='resume.pdf'
        )
    except Exception as e:
        print(f"PDF生成失败: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'PDF生成失败', 'message': str(e)}), 500

@app.route('/api/health')
def health():
    """健康检查"""
    return jsonify({'status': 'ok', 'service': 'resume-pdf-api-python'})

if __name__ == '__main__':
    print("简历PDF API服务启动在端口 3002")
    print("API地址: http://localhost:3002/api/resume/pdf")
    app.run(host='0.0.0.0', port=3002, debug=False)
