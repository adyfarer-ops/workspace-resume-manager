#!/usr/bin/env python3
"""
简历PDF生成器 - 直接生成HTML
单页无限延伸，样式与模板保持一致
"""

import json

# 读取JSON数据
def load_data():
    with open('/root/.openclaw/workspace-resume-manager/data/profile.json', 'r', encoding='utf-8') as f:
        profile = json.load(f)
    with open('/root/.openclaw/workspace-resume-manager/data/experience.json', 'r', encoding='utf-8') as f:
        experience = json.load(f)
    with open('/root/.openclaw/workspace-resume-manager/data/projects.json', 'r', encoding='utf-8') as f:
        projects = json.load(f)
    with open('/root/.openclaw/workspace-resume-manager/data/skills.json', 'r', encoding='utf-8') as f:
        skills = json.load(f)
    with open('/root/.openclaw/workspace-resume-manager/data/education.json', 'r', encoding='utf-8') as f:
        education = json.load(f)
    return profile, experience, projects, skills, education

# 生成HTML内容
def generate_html(profile, experience, projects, skills, education):
    html_parts = []
    
    # 头部信息
    html_parts.append(f'<div class="header">')
    html_parts.append(f'<h1>{profile["name"]}</h1>')
    html_parts.append(f'<div class="title">{profile["title"]}</div>')
    html_parts.append(f'<p class="quote">"{profile["quote"]}"</p>')
    html_parts.append('</div>')
    
    # 基本信息
    html_parts.append('<div class="section">')
    html_parts.append('<h2>基本信息</h2>')
    html_parts.append('<div class="info-grid">')
    html_parts.append(f'<div class="info-item"><span class="label">年龄：</span>{profile["contact"]["age"]}岁</div>')
    html_parts.append(f'<div class="info-item"><span class="label">籍贯：</span>{profile["contact"]["location"]}</div>')
    html_parts.append(f'<div class="info-item"><span class="label">电话：</span>{profile["contact"]["phone"]}</div>')
    html_parts.append(f'<div class="info-item"><span class="label">邮箱：</span>{profile["contact"]["email"]}</div>')
    html_parts.append('</div>')
    html_parts.append('</div>')
    
    # 教育背景
    html_parts.append('<div class="section">')
    html_parts.append('<h2>教育背景</h2>')
    for edu in education['education']:
        html_parts.append('<div class="edu-item">')
        html_parts.append(f'<h3>{edu["school"]}</h3>')
        html_parts.append(f'<div class="edu-major">{edu["major"]} | {edu["period"]}</div>')
        if edu.get('honors'):
            html_parts.append('<ul>')
            for honor in edu['honors']:
                html_parts.append(f'<li>{honor}</li>')
            html_parts.append('</ul>')
        html_parts.append('</div>')
    html_parts.append('</div>')
    
    # 专业技能
    html_parts.append('<div class="section">')
    html_parts.append('<h2>专业技能</h2>')
    for cat in skills['skills']['technical']:
        html_parts.append('<div class="skill-category">')
        html_parts.append(f'<div class="skill-name">{cat["category"]}</div>')
        html_parts.append(f'<div class="skill-items">{", ".join(cat["items"])}</div>')
        html_parts.append('</div>')
    html_parts.append('</div>')
    
    # 工作经历
    html_parts.append('<div class="section">')
    html_parts.append('<h2>工作经历</h2>')
    for exp in experience['experiences']:
        html_parts.append('<div class="exp-item">')
        html_parts.append(f'<h3>{exp["company"]}</h3>')
        html_parts.append(f'<div class="exp-role">{exp["position"]} | {exp["period"]}</div>')
        html_parts.append(f'<p>{exp["description"]}</p>')
        if exp.get('achievements'):
            html_parts.append('<ul>')
            for ach in exp['achievements']:
                html_parts.append(f'<li>{ach}</li>')
            html_parts.append('</ul>')
        html_parts.append('</div>')
    html_parts.append('</div>')
    
    # 项目经验
    html_parts.append('<div class="section">')
    html_parts.append('<h2>个人经验与项目</h2>')
    
    for proj in projects['projects']:
        html_parts.append('<div class="proj-item">')
        html_parts.append(f'<h3>{proj["name"]}</h3>')
        html_parts.append(f'<div class="proj-role">{proj["role"]} | {proj["period"]}</div>')
        html_parts.append(f'<p>{proj["description"]}</p>')
        
        # 子项目
        if proj.get('subProjects'):
            for sub in proj['subProjects']:
                html_parts.append('<div class="subproj-card">')
                html_parts.append(f'<div class="subproj-title">{sub["title"]}</div>')
                if sub.get('subtitle'):
                    html_parts.append(f'<div class="subproj-subtitle">{sub["subtitle"]}</div>')
                html_parts.append(f'<p>{sub["description"]}</p>')
                if sub.get('techStack'):
                    html_parts.append(f'<div class="meta"><strong>技术栈：</strong>{", ".join(sub["techStack"])}</div>')
                if sub.get('aiTools'):
                    html_parts.append(f'<div class="meta"><strong>AI工具：</strong>{", ".join(sub["aiTools"])}</div>')
                if sub.get('platforms'):
                    html_parts.append(f'<div class="meta"><strong>适配平台：</strong>{", ".join(sub["platforms"])}</div>')
                html_parts.append('</div>')
        
        # Coze项目详情
        if proj.get('details'):
            for i, detail in enumerate(proj['details'], 1):
                html_parts.append(f'<div class="coze-item">')
                html_parts.append(f'<div class="coze-number">{i:02d}</div>')
                html_parts.append(f'<div class="coze-content">{detail}</div>')
                html_parts.append('</div>')
        
        # 成就
        if proj.get('achievements'):
            html_parts.append('<div class="achievements">')
            html_parts.append('<strong>成果：</strong>')
            html_parts.append('<ul>')
            for ach in proj['achievements']:
                html_parts.append(f'<li>{ach}</li>')
            html_parts.append('</ul>')
            html_parts.append('</div>')
        
        html_parts.append('</div>')
    
    html_parts.append('</div>')
    
    # 自我评价
    html_parts.append('<div class="section">')
    html_parts.append('<h2>自我评价</h2>')
    html_parts.append(f'<p class="about">{profile["about"]}</p>')
    html_parts.append('</div>')
    
    return '\n'.join(html_parts)

# 生成完整HTML文档
def generate_full_html(content):
    css = """
    <style>
        @page {
            size: auto;
            margin: 0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", "SimHei", sans-serif;
            line-height: 1.8;
            color: #2c3e50;
            background: white;
            padding: 40px 50px;
            max-width: 1000px;
            margin: 0 auto;
        }
        
        /* 头部 */
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e8f5f2;
        }
        
        h1 {
            font-size: 42px;
            color: #264653;
            margin-bottom: 8px;
            letter-spacing: 2px;
        }
        
        .title {
            font-size: 18px;
            color: #2a9d8f;
            font-weight: 500;
            margin-bottom: 12px;
        }
        
        .quote {
            font-size: 14px;
            color: #546e7a;
            font-style: italic;
        }
        
        /* 章节 */
        .section {
            margin-bottom: 30px;
        }
        
        h2 {
            font-size: 22px;
            color: #264653;
            margin: 25px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e8f5f2;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        h2::before {
            content: "";
            width: 4px;
            height: 22px;
            background: #2a9d8f;
            border-radius: 2px;
        }
        
        h3 {
            font-size: 17px;
            color: #264653;
            margin: 18px 0 8px 0;
            font-weight: 700;
        }
        
        p {
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 1.8;
        }
        
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        li {
            margin-bottom: 6px;
            font-size: 14px;
            line-height: 1.7;
        }
        
        strong {
            color: #264653;
            font-weight: 600;
        }
        
        /* 基本信息网格 */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .info-item {
            font-size: 14px;
        }
        
        .label {
            color: #2a9d8f;
            font-weight: 500;
        }
        
        /* 技能 */
        .skill-category {
            margin-bottom: 12px;
        }
        
        .skill-name {
            font-size: 14px;
            font-weight: 600;
            color: #2a9d8f;
            margin-bottom: 4px;
        }
        
        .skill-items {
            font-size: 14px;
            color: #2c3e50;
        }
        
        /* 工作经历 */
        .exp-item, .edu-item, .proj-item {
            margin-bottom: 20px;
        }
        
        .exp-role, .proj-role, .edu-major {
            font-size: 14px;
            color: #2a9d8f;
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        /* 子项目卡片 */
        .subproj-card {
            background: #f0f9f7;
            border-radius: 8px;
            padding: 15px;
            margin: 12px 0;
        }
        
        .subproj-title {
            font-size: 15px;
            font-weight: 700;
            color: #2a9d8f;
            margin-bottom: 5px;
        }
        
        .subproj-subtitle {
            font-size: 13px;
            color: #546e7a;
            margin-bottom: 8px;
        }
        
        .meta {
            font-size: 13px;
            margin-top: 6px;
        }
        
        /* Coze项目 */
        .coze-item {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        
        .coze-number {
            width: 28px;
            height: 28px;
            background: #2a9d8f;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            flex-shrink: 0;
        }
        
        .coze-content {
            flex: 1;
            font-size: 14px;
            line-height: 1.7;
        }
        
        /* 成果 */
        .achievements {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px 15px;
            margin-top: 12px;
        }
        
        /* 自我评价 */
        .about {
            text-align: justify;
            line-height: 1.9;
        }
    </style>
    """
    
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>安鼎禹 - 简历</title>
    {css}
</head>
<body>
    {content}
</body>
</html>"""

# 主函数
def main():
    print("Loading data...")
    profile, experience, projects, skills, education = load_data()
    
    print("Generating HTML content...")
    content = generate_html(profile, experience, projects, skills, education)
    
    print("Generating full HTML document...")
    full_html = generate_full_html(content)
    
    # 保存文件
    output_path = '/root/.openclaw/workspace-resume-manager/project/public/resume-single.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    
    print(f"\n✅ HTML saved to: {output_path}")
    print(f"📄 File size: {len(full_html)} bytes")
    print("\nNext steps:")
    print("1. Open the HTML in browser")
    print("2. Print to PDF (Ctrl+P / Cmd+P)")
    print("3. Or use: wkhtmltopdf resume-single.html resume.pdf")
    
    return full_html

if __name__ == '__main__':
    main()
