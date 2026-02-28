#!/usr/bin/env python3
"""
简历PDF生成器 - Markdown转PDF
单页无限延伸，样式与模板保持一致
"""

import json
import markdown
from datetime import datetime

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

# 生成Markdown内容
def generate_markdown(profile, experience, projects, skills, education):
    md = []
    
    # 头部信息
    md.append(f"# {profile['name']}")
    md.append(f"## {profile['title']}")
    md.append(f"> {profile['quote']}")
    md.append("")
    
    # 基本信息
    md.append("## 基本信息")
    md.append(f"- **年龄：** {profile['contact']['age']}岁")
    md.append(f"- **籍贯：** {profile['contact']['location']}")
    md.append(f"- **电话：** {profile['contact']['phone']}")
    md.append(f"- **邮箱：** {profile['contact']['email']}")
    md.append("")
    
    # 教育背景
    md.append("## 教育背景")
    for edu in education['education']:
        md.append(f"### {edu['school']}")
        md.append(f"**{edu['major']}** | {edu['period']}")
        if edu.get('honors'):
            for honor in edu['honors']:
                md.append(f"- {honor}")
        md.append("")
    
    # 专业技能
    md.append("## 专业技能")
    for cat in skills['skills']['technical']:
        md.append(f"### {cat['category']}")
        md.append(f"{', '.join(cat['items'])}")
        md.append("")
    
    # 工作经历
    md.append("## 工作经历")
    for exp in experience['experiences']:
        md.append(f"### {exp['company']}")
        md.append(f"**{exp['position']}** | {exp['period']}")
        md.append(f"{exp['description']}")
        md.append("")
        if exp.get('achievements'):
            md.append("**主要成就：**")
            for ach in exp['achievements']:
                md.append(f"- {ach}")
            md.append("")
    
    # 项目经验
    md.append("## 个人经验与项目")
    for proj in projects['projects']:
        md.append(f"### {proj['name']}")
        md.append(f"**{proj['role']}** | {proj['period']}")
        md.append(f"{proj['description']}")
        
        # 子项目
        if proj.get('subProjects'):
            for sub in proj['subProjects']:
                md.append(f"#### {sub['title']}")
                if sub.get('subtitle'):
                    md.append(f"*{sub['subtitle']}*")
                md.append(f"{sub['description']}")
                if sub.get('techStack'):
                    md.append(f"**技术栈：** {', '.join(sub['techStack'])}")
                if sub.get('aiTools'):
                    md.append(f"**AI工具：** {', '.join(sub['aiTools'])}")
                md.append("")
        
        # Coze项目详情
        if proj.get('details'):
            for i, detail in enumerate(proj['details'], 1):
                md.append(f"{i}. {detail}")
            md.append("")
        
        # 成就
        if proj.get('achievements'):
            md.append("**成果：**")
            for ach in proj['achievements']:
                md.append(f"- {ach}")
            md.append("")
        
        md.append("")
    
    # 自我评价
    md.append("## 自我评价")
    md.append(profile['about'])
    
    return '\n'.join(md)

# 生成HTML（带样式）
def generate_html(markdown_content):
    # 转换markdown为HTML
    html_content = markdown.markdown(markdown_content, extensions=['extra'])
    
    # 添加CSS样式（与模板保持一致）
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
            max-width: 1200px;
            margin: 0 auto;
        }
        
        h1 {
            font-size: 42px;
            color: #264653;
            margin-bottom: 8px;
            letter-spacing: 2px;
        }
        
        h2 {
            font-size: 22px;
            color: #2a9d8f;
            margin: 30px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e8f5f2;
        }
        
        h3 {
            font-size: 17px;
            color: #264653;
            margin: 20px 0 8px 0;
            font-weight: 700;
        }
        
        h4 {
            font-size: 15px;
            color: #2a9d8f;
            margin: 15px 0 6px 0;
        }
        
        p {
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        li {
            margin-bottom: 6px;
            font-size: 14px;
        }
        
        blockquote {
            border-left: 3px solid #2a9d8f;
            padding-left: 15px;
            margin: 15px 0;
            color: #546e7a;
            font-style: italic;
        }
        
        strong {
            color: #264653;
            font-weight: 600;
        }
        
        em {
            color: #546e7a;
            font-size: 13px;
        }
        
        /* 技能标签样式 */
        .skill-category {
            margin-bottom: 14px;
        }
        
        .skill-name {
            font-size: 13px;
            font-weight: 600;
            color: #2a9d8f;
            margin-bottom: 4px;
        }
        
        .skill-items {
            font-size: 13px;
            color: #2c3e50;
            line-height: 1.7;
        }
        
        /* 项目卡片样式 */
        .project-card {
            background: #f0f9f7;
            border-radius: 10px;
            padding: 20px;
            margin: 12px 0;
        }
        
        .project-card-title {
            font-size: 15px;
            font-weight: 700;
            color: #2a9d8f;
            margin-bottom: 12px;
        }
        
        /* Coze项目编号 */
        .coze-item {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .coze-number {
            width: 24px;
            height: 24px;
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
        }
        
        .coze-title {
            font-size: 15px;
            font-weight: 700;
            color: #264653;
            margin-bottom: 4px;
        }
        
        .coze-desc {
            font-size: 13px;
            color: #546e7a;
        }
        
        /* 社交卡片 */
        .social-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 18px;
            margin-top: 12px;
        }
    </style>
    """
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>安鼎禹 - 简历</title>
    {css}
</head>
<body>
    {html_content}
</body>
</html>"""
    
    return html

# 保存文件
def save_files(markdown_content, html_content):
    # 保存Markdown
    with open('/root/.openclaw/workspace-resume-manager/project/public/resume.md', 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    # 保存HTML
    with open('/root/.openclaw/workspace-resume-manager/project/public/resume-md.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Files saved:")
    print("- resume.md (Markdown)")
    print("- resume-md.html (HTML with styles)")

# 主函数
def main():
    print("Loading data...")
    profile, experience, projects, skills, education = load_data()
    
    print("Generating markdown...")
    md_content = generate_markdown(profile, experience, projects, skills, education)
    
    print("Generating HTML...")
    html_content = generate_html(md_content)
    
    print("Saving files...")
    save_files(md_content, html_content)
    
    print("\nDone! You can now convert the HTML to PDF using:")
    print("1. Browser print to PDF")
    print("2. wkhtmltopdf")
    print("3. WeasyPrint")
    
    return md_content, html_content

if __name__ == '__main__':
    main()
