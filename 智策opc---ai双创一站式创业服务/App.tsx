
import React, { useState, useEffect, useMemo } from 'react';
import { AppSection, NavItem, ToolItem, User, ChatRecord } from './types';
import { TUTORING_TOOLS, REVIEW_CATEGORIES, COMPETENCY_TOOLS } from './constants';
import ChatInterface from './components/ChatInterface';
import { generateMarketingVideoPrompt } from './services/gemini';

const DEFAULT_USERS = [
  { username: 'admin', password: 'password123', nickname: '管理员', phone: '18109032004' }
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState(DEFAULT_USERS);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Auth States
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'password'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [authError, setAuthError] = useState('');

  // Marketing states
  const [marketingInput, setMarketingInput] = useState('');
  const [marketingResult, setMarketingResult] = useState('');
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const navItems: NavItem[] = [
    { id: AppSection.HOME, label: '首页' },
    { id: AppSection.TUTORING, label: 'AI辅导' },
    { id: AppSection.REVIEW, label: 'AI评审' },
    { id: AppSection.COMPETENCY, label: 'AI引导' },
    { id: AppSection.MARKETING, label: '产品营销' },
    { id: AppSection.BP_EVAL, label: '智绘BP' },
  ];

  const handleGetCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      alert("请输入正确的手机号");
      return;
    }
    setCountdown(60);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!agree) { setAuthError("请先阅读并同意服务条款和隐私政策"); return; }
    setLoginLoading(true);

    setTimeout(() => {
      if (authMode === 'register') {
        if (loginMethod === 'password') {
          if (password !== confirmPassword) { setAuthError("两次输入的密码不一致"); setLoginLoading(false); return; }
          if (registeredUsers.some(u => u.username === username)) { setAuthError("该用户名已被注册"); setLoginLoading(false); return; }
          setRegisteredUsers([...registeredUsers, { username, password, nickname: username, phone: '' }]);
          alert("注册成功！请登录。");
          setAuthMode('login');
          setPassword('');
          setConfirmPassword('');
        } else {
          setRegisteredUsers([...registeredUsers, { username: phone, password: '123', nickname: '手机用户', phone }]);
          setAuthMode('login');
        }
      } else {
        if (loginMethod === 'password') {
          const found = registeredUsers.find(u => u.username === username);
          if (!found) { setAuthError("该用户名未注册"); }
          else if (found.password !== password) { setAuthError("密码错误，请输入正确的密码"); }
          else {
            setUser({ nickname: found.nickname, username: found.username, phone: found.phone || '', isVip: false, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${found.username}`, chatCount: 0, records: [] });
            setActiveSection(AppSection.HOME);
          }
        } else {
          setUser({ nickname: phone, username: phone, phone, isVip: false, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`, chatCount: 0, records: [] });
          setActiveSection(AppSection.HOME);
        }
      }
      setLoginLoading(false);
    }, 800);
  };

  const handleLogout = () => { if (window.confirm("确定要退出登录吗？")) { setUser(null); setActiveSection(AppSection.HOME); setIsSearching(false); } };

  const handleToolSelect = (tool: ToolItem, section: AppSection) => {
    setActiveTool(tool);
    setActiveSection(section);
    setIsSearching(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { tool: ToolItem, section: AppSection }[] = [];

    TUTORING_TOOLS.forEach(t => {
      if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) {
        results.push({ tool: t, section: AppSection.TUTORING });
      }
    });

    COMPETENCY_TOOLS.forEach(t => {
      if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) {
        results.push({ tool: t, section: AppSection.COMPETENCY });
      }
    });

    REVIEW_CATEGORIES.forEach(c => {
      if (c.label.toLowerCase().includes(q) || c.track.toLowerCase().includes(q)) {
        results.push({ 
          tool: { id: c.id, title: c.label, description: `针对${c.track}的评审辅导`, category: '评审', systemPrompt: `你是一位“中国国际大学生创新大赛”评审专家。请根据该赛道评审规则，对用户提供的项目计划书进行深度评审。` },
          section: AppSection.REVIEW 
        });
      }
    });

    return results;
  }, [searchQuery]);

  const renderSearchOverlay = () => (
    <div className="max-w-7xl mx-auto px-10 py-20 animate-fade-in">
      <div className="flex justify-between items-center mb-12 border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-black text-slate-900">搜索结果: <span className="text-blue-600">"{searchQuery}"</span></h2>
        <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-600 font-bold">关闭结果 ✕</button>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchResults.map((res, i) => (
            <div 
              key={`${res.tool.id}-${i}`} 
              onClick={() => handleToolSelect(res.tool, res.section)}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {res.section === AppSection.TUTORING ? 'AI辅导' : res.section === AppSection.REVIEW ? 'AI评审' : 'AI引导'}
                </span>
                <span className="text-slate-300 group-hover:text-blue-500 transition-colors">❯</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{res.tool.title}</h4>
              <p className="text-slate-500 text-sm line-clamp-2">{res.tool.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-6 opacity-20">🔎</div>
          <p className="text-xl text-slate-400 font-medium">抱歉，没有找到匹配的助手，尝试更换关键词？</p>
        </div>
      )}
    </div>
  );

  const renderHome = () => (
    <div className="animate-fade-in overflow-hidden">
      {/* Optimized Hero Section */}
      <div className="relative min-h-[750px] w-full bg-[#0a0f2b] overflow-hidden flex flex-col justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-600/20 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute top-[20%] right-[15%] w-[20%] h-[20%] bg-indigo-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f2b]/50 via-transparent to-white"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-10 text-center z-10 py-10">
          <div className="inline-flex items-center gap-2 mb-8 glass px-5 py-2 rounded-full border border-white/10 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-white/80 text-xs font-bold tracking-widest uppercase">
              智策OPC：定义AI时代的精准评审与高效辅导
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-white leading-[1.15]">
            AI赋能OPC创业者<br />
            <span className="text-gradient">打造从0到1的一站式服务</span>
          </h1>
          
          <p className="text-white/70 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-12 font-medium">
            OPC是One Person Company的缩写。
            核心是个体借助AI工具完成全链路业务闭环，实现高效创业与创新。
          </p>

          {/* Moved Search Bar Up */}
          <div className="max-w-3xl mx-auto mb-12 flex gap-0 glass p-2 rounded-[32px] border border-white/10 shadow-2xl">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) setIsSearching(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && searchQuery.trim() && setIsSearching(true)}
              placeholder="搜索辅导、评审、胜任力引导助手..." 
              className="flex-1 px-8 py-5 bg-transparent border-none outline-none text-white text-lg placeholder:text-white/40" 
            />
            <button 
              onClick={() => searchQuery.trim() && setIsSearching(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[24px] font-black text-lg transition-all active:scale-95 shadow-xl"
            >
              立即搜索
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setActiveSection(AppSection.TUTORING)} 
              className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] flex items-center gap-3 active:scale-95"
            >
              开启创业之旅
              <span className="group-hover:translate-x-1 transition-transform">❯</span>
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('core-series');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all active:scale-95"
            >
              查看所有服务
            </button>
          </div>
        </div>
      </div>

      {isSearching ? renderSearchOverlay() : (
        <>
          {/* Core Series Section */}
          <div id="core-series" className="relative py-32 bg-white">
            <div className="max-w-7xl mx-auto px-10">
              <div className="text-center mb-20">
                <h2 className="text-4xl font-black text-slate-900 mb-6">核心服务体系</h2>
                <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { title: '双创项目辅导系列', icon: '🎓', color: 'bg-orange-50', text: 'text-orange-600', section: AppSection.TUTORING, desc: '从赛道明确到BP打磨的全链路辅导' },
                  { title: '创新大赛评审系列', icon: '🏆', color: 'bg-purple-50', text: 'text-purple-600', section: AppSection.REVIEW, desc: '复刻国赛标准的高精度压力训练' },
                  { title: '双创胜任力引导系列', icon: '🧠', color: 'bg-blue-50', text: 'text-blue-600', section: AppSection.COMPETENCY, desc: '激发创新思维与解决问题能力的引导' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setActiveSection(item.section);
                      setActiveTool(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="group cursor-pointer bg-white p-10 rounded-[48px] shadow-xl border border-slate-100 flex flex-col items-center transform hover:-translate-y-3 transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className={`w-28 h-28 ${item.color} ${item.text} rounded-[36px] flex items-center justify-center text-6xl mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>{item.icon}</div>
                    <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition">{item.title}</h3>
                    <p className="text-slate-400 text-sm text-center font-medium leading-relaxed">{item.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      立即进入 <span>❯</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tutoring Intro - Redesigned */}
          <div className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"></div>
            <div className="max-w-7xl mx-auto px-10 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                    <span className="w-12 h-1.5 bg-blue-600 rounded-full"></span>
                    创业项目辅导系列
                  </h2>
                  <p className="text-slate-600 text-xl leading-relaxed mb-10">
                    在OPC创业过程中，AI工具可以贯穿创业全流程：从帮助创业者明确赛道与方向出发，基于方向激发创意、打磨创新idea，到以创新为核心完成项目定位；再到项目BP打磨、商业逻辑梳理与路演实战训练。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {['找方向', '求创意', '定项目', '写BP', '练路演'].map((step, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setActiveSection(AppSection.TUTORING);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 font-bold text-slate-700 hover:border-blue-200 hover:shadow-md transition cursor-pointer"
                      >
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm">{i+1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[50px] p-2 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-full object-cover rounded-[48px] mix-blend-multiply opacity-80" 
                      alt="Team collaboration" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="glass p-8 rounded-full shadow-2xl">
                        <div className="text-white text-4xl">⚡</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 animate-float">
                    <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">AI Capability</div>
                    <div className="text-slate-800 font-bold">赋能单人公司创业</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderTutoring = () => (
    <div className="max-w-7xl mx-auto px-10 py-20 animate-fade-in">
      <div className="mb-12 border-b border-slate-200 pb-10 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">创业项目辅导系列</h2>
        <p className="text-slate-500 text-lg">全流程陪伴OPC创业者把项目做深、做实、做成</p>
      </div>
      {activeTool ? (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xl">
           <button onClick={() => setActiveTool(null)} className="mb-6 text-blue-600 font-bold hover:underline">❮ 返回辅导列表</button>
           <ChatInterface title={activeTool.title} systemPrompt={activeTool.systemPrompt} useSearch={true} />
        </div>
      ) : (
        <div className="space-y-24">
          {['找方向', '求创意', '定项目', '写BP', '练路演'].map(cat => (
            <div key={cat}>
               <h3 className="text-3xl font-black mb-10 flex items-center gap-4 text-slate-800">
                 <span className="w-3 h-10 bg-orange-400 rounded-full"></span>
                 {cat}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {TUTORING_TOOLS.filter(t => t.category === cat).map(tool => (
                   <div key={tool.id} onClick={() => setActiveTool(tool)} className="bg-white p-10 border border-slate-100 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-orange-200 transition-all cursor-pointer group flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition">{tool.title}</h4>
                        <span className="bg-orange-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">聊一聊</span>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-1">{tool.description}</p>
                      <div className="text-orange-600 font-bold text-sm">进入对话 ❯</div>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderReview = () => (
    <div className="max-w-7xl mx-auto px-10 py-20 animate-fade-in">
      <div className="mb-12 border-b border-slate-200 pb-10 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-6">创新创业评审系列</h2>
        <p className="text-slate-500 text-lg max-w-4xl mx-auto leading-relaxed">
          专为创业者打造的「赛前训练场」：复刻真实大赛的评审标准、质询节奏，帮您把项目逻辑捋顺、把核心优势讲透，把临场紧张感磨掉。
        </p>
      </div>
      {activeTool ? (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xl">
           <button onClick={() => setActiveTool(null)} className="mb-6 text-purple-600 font-bold hover:underline">❮ 返回赛道列表</button>
           <ChatInterface title={activeTool.title} systemPrompt={activeTool.systemPrompt} placeholder="请上传您的项目计划书PDF or 直接输入项目内容..." />
        </div>
      ) : (
        <div className="space-y-16">
          {['高教赛道', '职教赛道', '红旅赛道'].map(track => (
            <div key={track}>
              <h3 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                {track}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {REVIEW_CATEGORIES.filter(c => c.track === track).map(cat => (
                  <div key={cat.id} onClick={() => setActiveTool({ id: cat.id, title: cat.label, description: `针对${track}的评审辅导`, category: '评审', systemPrompt: `你是一位“中国国际大学生创新大赛”评审专家。请根据该赛道评审规则，对用户提供的项目计划书进行深度评审。` })} className="bg-white p-8 border border-slate-100 rounded-3xl flex justify-between items-center group hover:border-purple-400 hover:shadow-xl transition cursor-pointer">
                    <div className="flex-1 mr-4">
                       <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-purple-600 transition">{cat.label}</h4>
                       <p className="text-xs text-slate-400">基于国赛评审规则，提供专业建议</p>
                    </div>
                    <div className="bg-purple-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg">聊一聊</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCompetency = () => (
    <div className="max-w-7xl mx-auto px-10 py-20 animate-fade-in">
      <div className="mb-12 border-b border-slate-200 pb-10 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-6">双创胜任力引导系列</h2>
        <p className="text-slate-500 text-lg max-w-4xl mx-auto leading-relaxed">
          精准的问题引导：从机遇捕捉到挑战应对，从需求发现到价值创造，全方位提升您的创新创业能力。
        </p>
      </div>
      {activeTool ? (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xl">
           <button onClick={() => setActiveTool(null)} className="mb-6 text-blue-600 font-bold hover:underline">❮ 返回引导分类</button>
           <ChatInterface title={activeTool.title} systemPrompt={activeTool.systemPrompt} />
        </div>
      ) : (
        <div className="space-y-24">
          {['发现机会', '创新力', '愿景规划'].map(cat => (
            <div key={cat}>
               <h3 className="text-3xl font-black mb-10 flex items-center gap-4 text-slate-800">
                 <span className="w-3 h-10 bg-blue-600 rounded-full"></span>
                 {cat}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {COMPETENCY_TOOLS.filter(t => t.category === cat).map(tool => (
                   <div key={tool.id} onClick={() => setActiveTool(tool)} className="bg-white p-10 border border-slate-100 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer group flex flex-col text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition duration-300 text-2xl">
                        {cat === '发现机会' ? '🔍' : cat === '创新力' ? '💡' : '🗺️'}
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-4">{tool.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed flex-1 mb-8">{tool.description}</p>
                      <button className="bg-blue-50 text-blue-600 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition">聊一聊</button>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMarketing = () => (
    <div className="max-w-7xl mx-auto px-10 py-20 animate-fade-in">
      <div className="mb-12 border-b border-slate-200 pb-10 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-6">OPC创业制作产品营销</h2>
        <p className="text-slate-500 text-lg max-w-4xl mx-auto">
          通过一句话提示词OPC创业者即可快速生成具备情绪感染力与传播力的广告视频。
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100">
          <h3 className="text-2xl font-bold mb-8">视频营销助手</h3>
          <textarea 
            value={marketingInput}
            onChange={(e) => setMarketingInput(e.target.value)}
            placeholder="例如：帮我制作一个非常感人的复古蒙太奇风格广告，来推广这个产品。"
            className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-lg"
          />
          <button onClick={async () => {
            if (!marketingInput.trim()) return;
            setIsMarketingLoading(true);
            try { setMarketingResult(await generateMarketingVideoPrompt(marketingInput)); }
            catch (e) { setMarketingResult("生成失败。"); }
            finally { setIsMarketingLoading(false); }
          }} disabled={isMarketingLoading} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl mt-8 shadow-xl hover:bg-blue-700 transition">
            {isMarketingLoading ? '正在分析创意...' : '生成营销视频脚本 ❯'}
          </button>
          {marketingResult && (
            <div className="mt-10 p-8 bg-blue-50 rounded-3xl border border-blue-100 text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
              {marketingResult}
            </div>
          )}
        </div>
        <div className="space-y-10 flex flex-col justify-center">
           <div className="bg-slate-900 rounded-[40px] aspect-video overflow-hidden shadow-2xl relative">
              <img src="https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60" alt="Video" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-3xl border border-white/30 cursor-pointer">▶</div>
              </div>
           </div>
           <p className="text-slate-500 text-center italic">Sora/Veo 模拟生成预览 - 提升品牌获客与引流效果</p>
        </div>
      </div>
    </div>
  );

  const renderBPEval = () => (
    <div className="max-w-7xl mx-auto px-10 py-20 animate-fade-in">
      <div className="mb-12 border-b border-slate-200 pb-10 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-6">智绘BP · 链接资本</h2>
        <p className="text-slate-500 text-lg max-w-4xl mx-auto">
          覆盖从商业计划书打磨到投融资对接的完整流程，系统性提升项目融资准备度。
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          { title: 'AI赛道种子轮评估框架', date: '2025年7月版', range: '500万人民币以内' },
          { title: 'AI赛道天使轮评估框架', date: '2025年7月版', range: '500万到2000万' },
          { title: '顶级投资基金定制框架', date: '敬请期待', range: '各行业深度定制' }
        ].map((item, i) => (
          <div key={i} className={`bg-white p-12 rounded-[50px] shadow-xl border border-slate-100 flex flex-col text-center ${i === 2 && 'opacity-50'}`}>
            <h3 className="text-2xl font-black mb-4">{item.title}</h3>
            <div className="text-blue-600 font-bold text-sm mb-6 uppercase tracking-widest">{item.date}</div>
            <p className="text-slate-500 mb-10">拟融资额：{item.range}</p>
            <button className="mt-auto bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition">立即评估 ❯</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case AppSection.HOME: return renderHome();
      case AppSection.TUTORING: return renderTutoring();
      case AppSection.REVIEW: return renderReview();
      case AppSection.COMPETENCY: return renderCompetency();
      case AppSection.MARKETING: return renderMarketing();
      case AppSection.BP_EVAL: return renderBPEval();
      case AppSection.LOGIN: return renderLogin();
      case AppSection.PROFILE: return (
        <div className="max-w-7xl mx-auto px-10 py-20 text-center">
          <h2 className="text-3xl font-black mb-6">个人中心</h2>
          <p className="mb-10 text-slate-500">欢迎回来，<span className="text-blue-600 font-bold">{user?.nickname}</span></p>
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md mx-auto">
             <div className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-blue-100 overflow-hidden shadow-sm">
                <img src={user?.avatar} className="w-full h-full object-cover" alt="avatar" />
             </div>
             <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-slate-400 text-sm">用户名</span>
                 <span className="font-bold">{user?.username}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-slate-400 text-sm">手机号</span>
                 <span className="font-bold">{user?.phone || '未绑定'}</span>
               </div>
             </div>
             <button onClick={handleLogout} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black hover:bg-red-600 transition shadow-lg">退出登录</button>
          </div>
        </div>
      );
      default: return renderHome();
    }
  };

  const renderLogin = () => (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col relative overflow-hidden animate-fade-in">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover brightness-50" alt="bg" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto w-full px-10 flex-1 flex flex-col md:flex-row items-center justify-between gap-10 py-20">
        <div className="text-white md:w-1/2 space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">智策OPC，助力每一份耕耘</h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-lg">
            {authMode === 'login' ? "欢迎回来！请登录您的账号以继续体验AI双创助手。" : "创建账号即可体验全方位的AI创业辅导与评审系统。"}
          </p>
        </div>
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md border border-white/20">
          <div className="flex mb-8 border-b border-slate-100">
             <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`flex-1 py-3 font-bold transition ${authMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>登录</button>
             <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`flex-1 py-3 font-bold transition ${authMode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>注册</button>
          </div>
          <form onSubmit={handleAuth} className="space-y-5">
            {loginMethod === 'phone' ? (
              <div className="space-y-4">
                <input type="tel" placeholder="请输入手机号" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <div className="flex gap-2">
                  <input type="text" placeholder="请输入验证码" className="flex-1 px-4 py-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={code} onChange={(e) => setCode(e.target.value)} required />
                  <button type="button" onClick={handleGetCode} disabled={countdown > 0} className="bg-blue-600/90 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap disabled:bg-slate-300">{countdown > 0 ? `${countdown}s` : '获取验证码'}</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input type="text" placeholder="请输入用户名" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="请输入密码" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {authMode === 'register' && <input type="password" placeholder="请确认密码" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />}
              </div>
            )}
            {authError && <div className="text-red-500 text-sm font-bold">⚠️ {authError}</div>}
            <div className="flex justify-between items-center text-sm">
              <button type="button" onClick={() => { setLoginMethod(loginMethod === 'phone' ? 'password' : 'phone'); setAuthError(''); }} className="text-blue-600 font-bold hover:underline">{loginMethod === 'phone' ? '账号密码登录' : '手机快捷登录'}</button>
            </div>
            <button type="submit" disabled={loginLoading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition disabled:opacity-50">
              {loginLoading ? '提交中...' : (authMode === 'login' ? '立即登录' : '立即注册')}
            </button>
            <div className="flex items-start gap-2 text-[12px] text-slate-500 leading-tight">
              <input type="checkbox" className="mt-1" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <label htmlFor="agree">我已阅读并同意 <span className="text-blue-500">《服务条款》</span> 和 <span className="text-blue-500">《隐私政策》</span></label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-[#1a2b5d] text-white h-20 fixed top-0 w-full z-50 flex items-center px-10 justify-between shadow-2xl">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setActiveSection(AppSection.HOME); setActiveTool(null); setIsSearching(false); setSearchQuery(''); }}>
           <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-blue-400">智</div>
           <span className="text-2xl font-black tracking-tight">智策OPC</span>
        </div>
        <div className="flex gap-8">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setActiveTool(null); setIsSearching(false); setSearchQuery(''); }} className={`text-sm font-bold tracking-wide transition relative py-2 ${activeSection === item.id && !isSearching ? 'text-white border-b-2 border-blue-400' : 'text-white/70 hover:text-white'}`}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div onClick={() => { setActiveSection(AppSection.PROFILE); setIsSearching(false); }} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 rounded-full border-2 border-blue-400 overflow-hidden group-hover:scale-110 transition">
                <img src={user.avatar} className="w-full h-full object-cover" alt="user" />
              </div>
              <span className="text-sm font-bold">{user.nickname}</span>
            </div>
          ) : (
            <button onClick={() => { setActiveSection(AppSection.LOGIN); setAuthError(''); setIsSearching(false); }} className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-full text-sm font-black shadow-lg transition transform active:scale-95">立即登录</button>
          )}
        </div>
      </nav>

      <div className="mt-20 flex-1">
        {renderSectionContent()}
      </div>

      <footer className="bg-[#0a0f2b] text-slate-400 py-20 px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">智</div>
             <span className="text-2xl font-black text-white">智策OPC</span>
          </div>
          <p className="text-sm opacity-60 text-center max-w-2xl font-medium">智策OPC：AI时代的精准评审与高效辅导专家。致力于打造从0到1的一站式创业服务体系。</p>
          <div className="pt-10 border-t border-white/5 w-full text-[10px] uppercase font-bold tracking-widest text-center opacity-40">
            京ICP备2022026886号-2 © 智策OPC版权所有
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
