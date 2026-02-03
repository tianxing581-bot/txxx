
import { ToolItem } from './types';

export const TUTORING_TOOLS: ToolItem[] = [
  // 找方向 (PDF Page 2 & 4)
  { 
    id: 'macro', 
    category: '找方向', 
    title: '宏观交集法', 
    description: '通过政策、技术、行业和区域经济的趋势分析，找到项目方向。', 
    systemPrompt: '你是一位资深创业导师。请使用“宏观交集法”，结合政策、前沿技术、行业痛点和区域经济特色，引导用户分析并寻找精准的创业方向。' 
  },
  { 
    id: 'report', 
    category: '找方向', 
    title: '研报分析法', 
    description: '通过各类研究报告和行业分析报告、白皮书等，把握最新的市场动态，进而确定项目方向。', 
    systemPrompt: '你是一位市场调研专家。请引导用户分析行业研报、白皮书，从市场数据、竞争格局和发展趋势中提炼有价值的项目切入点。' 
  },
  { 
    id: 'professional', 
    category: '找方向', 
    title: '专业沉淀法', 
    description: '帮助您从自己专业的角度，挖掘项目方向，发现机会。', 
    systemPrompt: '引导用户根据其专业背景、技术积累和兴趣特长，深入挖掘具有差异化竞争优势的创业机会。' 
  },
  // 求创意 (PDF Page 2 & 4)
  { 
    id: 'sample', 
    category: '求创意', 
    title: '样本研究法', 
    description: '通过样本项目的产品或服务的研究，为您提供项目的参照对象，有利于在强者的基础上激发顶...', 
    systemPrompt: '深度拆解行业内成功样本项目（功能、体验、优势），引导用户在借鉴的基础上进行二次创新。' 
  },
  { 
    id: 'biz_model_innov', 
    category: '求创意', 
    title: '商业模式创新法', 
    description: '帮您从特定行业领域中商业模式要素的多角度进行分析，为您的项目创意提供帮助。', 
    systemPrompt: '运用商业模式画布等工具，引导用户从价值主张、渠道、盈利模式等维度对现有模式进行重构。' 
  },
  // 定项目 (PDF Page 2, 5 & 6)
  { 
    id: 'feasibility', 
    category: '定项目', 
    title: '项目可行性', 
    description: '请针对指定市场中的具体项目，提出对这个项目的全面分析，并针对每项输出内容给出具体的...', 
    systemPrompt: '对用户的项目进行全面可行性分析，涵盖市场需求、技术可行性、财务可行性等方面，评估市场潜力。' 
  },
  { 
    id: 'core_product', 
    category: '定项目', 
    title: '核心产品与服务', 
    description: '针对指定市场中的具体项目或创意，提出这个项目的产品设计指导建议。', 
    systemPrompt: '针对项目创意提出产品设计建议，明确核心竞争力并强调产品的创新性、实用性。' 
  },
  { 
    id: 'benchmarking', 
    category: '定项目', 
    title: '项目对标分析', 
    description: '请针对指定市场中的具体项目产品进行系统性分析，提出创业项目可参考的建议。', 
    systemPrompt: '分析市场上同类产品的优势与不足，为用户项目提供差异化竞争策略。' 
  },
  { 
    id: 'operation_design', 
    category: '定项目', 
    title: '项目运营设计', 
    description: '针对您的项目产品进行创业准备和项目运营的具体设计，提出创业的具体建议。', 
    systemPrompt: '协助用户设计项目运营方案，包括市场营销、团队建设、财务管理等具体设计。' 
  },
  // 写BP (PDF Page 2, 3 & 6)
  { 
    id: 'bp_overview', 
    category: '写BP', 
    title: '项目概述', 
    description: '提供可满足1分钟说明的项目概述。', 
    systemPrompt: '协助用户撰写精炼且有吸引力的项目概述，确保能在1分钟内讲清核心价值。' 
  },
  { 
    id: 'bp_market', 
    category: '写BP', 
    title: '市场分析', 
    description: '针对指定市场中的具体项目，提出对这个项目的全面市场分析，并针对每项输出内容给出具体...', 
    systemPrompt: '引导用户进行深度的市场分析，包括市场规模、竞争态势、目标客户等。' 
  },
  { 
    id: 'bp_product', 
    category: '写BP', 
    title: '产品说明', 
    description: '针对指定市场中的具体项目产品，提出具有竞争力的项目产品设计说明。', 
    systemPrompt: '指导用户清晰呈现产品功能与技术优势，突出为何该产品更具竞争力。' 
  },
  { 
    id: 'bp_model', 
    category: '写BP', 
    title: '商业模式', 
    description: '针对项目设计完整的商业模式，并针对各项商业模式要素内容给出具体的创新建议。', 
    systemPrompt: '协助梳理商业盈利闭环，明确盈利模式和发展战略。' 
  },
  { 
    id: 'bp_team', 
    category: '写BP', 
    title: '项目团队', 
    description: '针对创业项目设计创业团队说明，提出创业团队的具体建议。', 
    systemPrompt: '指导如何撰写核心团队背景，展示团队成员的专业能力和团队协作精神。' 
  },
  { 
    id: 'bp_finance', 
    category: '写BP', 
    title: '财务分析', 
    description: '为创业项目设计财务说明。', 
    systemPrompt: '引导用户完成基本的财务分析，包括预算、收入预测和成本控制。' 
  },
  { 
    id: 'bp_vision', 
    category: '写BP', 
    title: '发展规划与愿景', 
    description: '设计项目5年的发展规划。', 
    systemPrompt: '指导用户制定具有前瞻性和可行性的项目发展规划，明确短期和长期目标。' 
  },
  // 练路演 (PDF Page 3 & 6)
  { 
    id: 'rs_script', 
    category: '练路演', 
    title: '撰写路演讲稿', 
    description: '请针对创业项目撰写路演讲稿。', 
    systemPrompt: '根据项目BP内容，协助撰写富有感染力、逻辑严密的3-5分钟路演讲稿。' 
  },
  { 
    id: 'rs_ppt', 
    category: '练路演', 
    title: '编制路演PPT内容', 
    description: '针对创业项目，从便于获得融资的角度，撰写一份路演所需的PPT内容大纲。', 
    systemPrompt: '规划路演PPT的逻辑框架，确保核心重点突出。' 
  },
  { 
    id: 'rs_video', 
    category: '练路演', 
    title: '项目展示视频的创意', 
    description: '针对具体创业项目，从便于获得融资和吸引眼球的角度，提供创作项目展示说明视频的建议。', 
    systemPrompt: '提供新颖独特的项目展示视频创意建议，提高路演吸引力。' 
  },
  { 
    id: 'rs_qa', 
    category: '练路演', 
    title: '项目路演答辩训练', 
    description: '通过问题的思考，帮助路演者完成路演答辩的准备。', 
    systemPrompt: '模拟评委进行针对性提问，进行路演答辩训练，全面提升路演技巧。' 
  }
];

export const COMPETENCY_TOOLS: ToolItem[] = [
  // 发现机会 (PDF Page 10)
  { id: 'c_opp', category: '发现机会', title: '把握机遇', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '引导用户识别行业中的潜在线索并转化为商业机遇。' },
  { id: 'c_challenge', category: '发现机会', title: '关注挑战', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '分析阻碍创业的关键因素并探讨转化策略。' },
  { id: 'c_needs', category: '发现机会', title: '发现需求', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '引导用户通过需求发现到价值创造发现市场真实需求。' },
  { id: 'c_status', category: '发现机会', title: '分析形势', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '引导进行宏观环境与微观竞争格局的分析。' },
  // 创新力 (PDF Page 10)
  { id: 'c_curiosity', category: '创新力', title: '好奇心与开放性思维', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '通过好奇心引导，激发用户的创新思维。' },
  { id: 'c_idea', category: '创新力', title: '提出创意', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '引导用户提出具有创新性的项目创意。' },
  { id: 'c_def', category: '创新力', title: '定义问题', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '引导用户定义核心痛点。' },
  { id: 'c_value', category: '创新力', title: '价值主张', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '协助用户构建价值主张。' },
  { id: 'c_transform', category: '创新力', title: '变革能力', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '引导用户思考如何应对变化。' },
  // 愿景规划 (PDF Page 11)
  { id: 'c_imagination', category: '愿景规划', title: '想象力', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '引导用户进行事业蓝图规划。' },
  { id: 'c_strategy', category: '愿景规划', title: '战略思维', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '协助用户进行战略顶层设计。' },
  { id: 'c_action', category: '愿景规划', title: '行动规划', description: '您只需要提供专业方向、行业领域和项目内容，即可生成引导学生结合自身情况，思考...', systemPrompt: '协助制定近期的行动规划。' }
];

export const REVIEW_CATEGORIES = [
  // PDF Page 8 & 9
  { id: 'h_startup', label: '高教创业组评审与辅导', track: '高教赛道' },
  { id: 'h_creative', label: '高教创意组评审与辅导', track: '高教赛道' },
  { id: 'v_creative', label: '职教创意组评审与辅导', track: '职教赛道' },
  { id: 'v_startup', label: '职教创业组评审与辅导', track: '职教赛道' },
  { id: 'r_creative', label: '红旅创意组评审与辅导', track: '红旅赛道' },
  { id: 'r_startup', label: '红旅创业组评审与辅导', track: '红旅赛道' },
  { id: 'r_social', label: '红旅公益组评审与辅导', track: '红旅赛道' }
];
