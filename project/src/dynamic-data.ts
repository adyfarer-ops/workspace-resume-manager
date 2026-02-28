// 动态数据加载模块
// 优先从 data 目录加载 JSON，如果不存在则使用内置数据

import { Profile } from './types';

// 内置默认数据（硬编码作为fallback）
const DEFAULT_PROFILE: Profile = {
  name: "安鼎禹",
  title: "Web前端开发工程师 / AI智能体开发 / AI编程",
  quote: "偷得浮生半日闲，明天依旧打工人。",
  avatar: "https://picsum.photos/400/400?grayscale",
  about: "拥有扎实的前端开发经验，并积极拥抱AI技术变革。不仅在传统Web开发领域有丰富的实战经验，更在AI Agent开发、Coze工作流搭建及自媒体运营方面取得了显著成果。具备全栈思维与产品意识，能够利用AI工具赋能开发，实现从0到1的产品落地与流量增长。",
  contact: {
    age: 27,
    location: "河南",
    phone: btoa("17630830323"),
    email: "yfarer@163.com"
  },
  education: [
    {
      school: "漯河职业技术职业学院",
      major: "计算机应用技术",
      period: "2016.09 - 2019.06",
      honors: [
        "2017年11月 荣获国家励志奖学金",
        "有普通话等级证书",
        "有计算机等级证书"
      ]
    }
  ],
  skills: [
    {
      title: "AI 智能体开发",
      skills: ["n8n", "Dify", "Coze(扣子)", "Workflow编排", "Prompt Engineering", "角色扮演", "任务拆解"]
    },
    {
      title: "Web 开发",
      skills: ["Vue3", "HTML5", "CSS3", "JavaScript", "小程序", "Uni-app"]
    },
    {
      title: "AI 工具使用",
      skills: ["Kimi.ai", "GPT-4", "Gemini", "Sora2", "即梦", "豆包"]
    },
    {
      title: "AI 编程工具",
      skills: ["Cursor", "Trae", "Kiro", "Antigravity"]
    },
    {
      title: "设计与媒体",
      skills: ["Figma", "Stitch", "剪映", "抖音运营", "小红书运营"]
    }
  ],
  workExperience: [
    {
      company: "上海星漫科技有限公司",
      role: "Web前端开发工程师",
      period: "2021.05 - 2023.03",
      details: [
        "负责Web、H5以及小程序页面的开发，根据UI设计图精确还原页面；",
        "负责页面的动态数据交互，与后台人员交接，测试并优化接口；",
        "完成小程序商城支付功能开发；",
        "对接腾讯云直播和云点播，使用live-pusher/live-player组件实现推拉流；",
        "优化公司原有框架，参与公共组件方案设计，提升项目易用性与开发效率；",
        "指导新人，提升团队整体技术水平。"
      ]
    },
    {
      company: "上海中圳科技有限公司",
      role: "Web前端开发工程师",
      period: "2019.07 - 2021.04",
      details: [
        "负责老项目的优化迭代与新页面开发，维护业务稳定性；",
        "对Element组件进行二次封装，提升用户体验与开发效率；",
        "使用Uni-app开发跨平台应用，主导「芥末交友」等社交产品的开发；",
        "根据用户需求完善页面功能，配合后端完成数据交互。"
      ]
    }
  ],
  projects: [],
  notes: []
};

// 动态加载数据的函数
export async function loadProfileData(): Promise<Profile> {
  try {
    // 尝试从 data 目录加载 JSON 文件
    const [profileRes, experienceRes, educationRes, skillsRes, projectsRes] = await Promise.all([
      fetch('/data/profile.json').catch(() => null),
      fetch('/data/experience.json').catch(() => null),
      fetch('/data/education.json').catch(() => null),
      fetch('/data/skills.json').catch(() => null),
      fetch('/data/projects.json').catch(() => null)
    ]);

    // 如果任何一个文件加载失败，使用默认数据
    if (!profileRes || !experienceRes || !educationRes || !skillsRes || !projectsRes) {
      console.log('⚠️ 无法加载动态数据，使用默认数据');
      return DEFAULT_PROFILE;
    }

    // 解析 JSON
    const [profile, experience, education, skills, projects] = await Promise.all([
      profileRes.json(),
      experienceRes.json(),
      educationRes.json(),
      skillsRes.json(),
      projectsRes.json()
    ]);

    // 转换数据格式
    const skillsFormatted = skills.skills.technical.map((cat: any) => ({
      title: cat.category,
      skills: cat.items
    }));

    const workExperience = experience.experiences.map((exp: any) => ({
      company: exp.company,
      role: exp.position,
      period: exp.period,
      details: exp.description.split('；').filter((d: string) => d.trim())
    }));

    const projectsFormatted = projects.projects.map((proj: any) => ({
      name: proj.name,
      role: proj.role,
      period: proj.period,
      tags: proj.tags,
      description: proj.description ? [proj.description] : [],
      subProjects: proj.subProjects || [],
      highlight: proj.highlight || false
    }));

    // 合并数据
    const mergedProfile: Profile = {
      name: profile.name,
      title: profile.title,
      quote: profile.quote,
      avatar: profile.avatar,
      about: profile.about,
      contact: {
        age: profile.contact.age,
        location: profile.contact.location,
        phone: btoa(profile.contact.phone),
        email: profile.contact.email
      },
      education: education.education,
      skills: skillsFormatted,
      workExperience: workExperience,
      projects: projectsFormatted,
      notes: []
    };

    console.log('✅ 动态数据加载成功');
    return mergedProfile;

  } catch (error) {
    console.error('❌ 加载数据失败:', error);
    return DEFAULT_PROFILE;
  }
}

// 同步获取默认数据（用于初始渲染）
export function getDefaultProfile(): Profile {
  return DEFAULT_PROFILE;
}
