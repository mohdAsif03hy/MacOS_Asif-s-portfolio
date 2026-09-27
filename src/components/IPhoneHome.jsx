import React, { useState, useEffect, useRef } from 'react';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';
import { locations } from '#constants';
import {
    Wifi,
    Signal,
    Battery,
    Search,
    MapPin,
    ExternalLink,
    Sparkles,
    Trophy,
    GitCommit,
    ChevronRight,
    Folder,
    Activity,
    TrendingUp,
    Leaf,
    MessageSquare,
    Globe2,
    BarChart3,
} from 'lucide-react';

const IPhoneHome = () => {
    const { openWindow } = useWindowStore();
    const { setActiveLocation } = useLocationStore();
    const [currentTime, setCurrentTime] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const scrollContainerRef = useRef(null);

    const [liveStats, setLiveStats] = useState({
        totalSolved: 207,
        ranking: '#834k',
        streak: '72d',
        totalCommits: '530+',
        easySolved: 140,
        mediumSolved: 65,
        hardSolved: 2,
        repos: 15,
    });

    useEffect(() => {
        let isMounted = true;
        const fetchStats = async () => {
            try {
                const [lcRes, ghRes] = await Promise.all([
                    fetch('https://leetcode-api-faisalshohag.vercel.app/rk12SuClSa').then((r) => r.ok ? r.json() : null).catch(() => null),
                    fetch('https://github-contributions-api.jogruber.de/v4/mohdAsif03hy?y=last').then((r) => r.ok ? r.json() : null).catch(() => null),
                ]);

                if (isMounted) {
                    setLiveStats((prev) => ({
                        ...prev,
                        totalSolved: lcRes?.totalSolved || prev.totalSolved,
                        ranking: lcRes?.ranking ? `#${Math.round(Number(lcRes.ranking) / 1000)}k` : prev.ranking,
                        easySolved: lcRes?.easySolved ?? prev.easySolved,
                        mediumSolved: lcRes?.mediumSolved ?? prev.mediumSolved,
                        hardSolved: lcRes?.hardSolved ?? prev.hardSolved,
                        totalCommits: ghRes?.total?.lastYear ? `${ghRes.total.lastYear}+` : prev.totalCommits,
                    }));
                }
            } catch {
                // silent fallback to default stats
            }
        };

        const timer = setTimeout(fetchStats, 1200);
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const displayHours = hours % 12 || 12;
            setCurrentTime(`${displayHours}:${minutes}`);
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleScroll = (e) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const width = e.currentTarget.offsetWidth;
        if (width > 0) {
            const pageIndex = Math.round(scrollLeft / width);
            if (pageIndex !== currentPage) {
                setCurrentPage(pageIndex);
            }
        }
    };

    const scrollToPage = (pageIndex) => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollTo({
                left: pageIndex * width,
                behavior: 'smooth',
            });
            setCurrentPage(pageIndex);
        }
    };

    const handleOpenAbout = () => {
        const aboutFile = locations.about?.children?.find((c) => c.fileType === 'txt') || locations.about?.children?.[3];
        if (aboutFile) {
            openWindow('txtfile', aboutFile);
        } else {
            openWindow('finder');
        }
    };

    const handleOpenFinder = () => {
        if (locations.work) {
            setActiveLocation(locations.work);
        }
        openWindow('finder');
    };

    const handleOpenProject = (index) => {
        const target = locations.work?.children?.[index];
        if (target) {
            setActiveLocation(target);
            openWindow('finder');
        } else {
            handleOpenFinder();
        }
    };

    // Primary 8 Apps for Page 1
    const page1Apps = [
        {
            id: 'projects',
            name: 'Projects',
            icon: '/images/finder.webp',
            bg: 'bg-[#1c1c1e]',
            onClick: handleOpenFinder,
        },
        {
            id: 'safari',
            name: 'Articles',
            icon: '/images/safari.webp',
            bg: 'bg-white',
            onClick: () => openWindow('safari'),
        },
        {
            id: 'photos',
            name: 'Gallery',
            icon: '/images/photos.webp',
            bg: 'bg-white',
            onClick: () => openWindow('photos'),
        },
        {
            id: 'terminal',
            name: 'Skills',
            icon: '/images/terminal.webp',
            bg: 'bg-[#1e1e1e]',
            onClick: () => openWindow('terminal'),
        },
        {
            id: 'activity',
            name: 'Contributions',
            renderIcon: <Activity className='w-7 h-7 text-white stroke-[2.4] drop-shadow' />,
            bg: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400',
            onClick: () => openWindow('trash'),
        },
        {
            id: 'resume',
            name: 'Resume',
            icon: '/images/pdf.webp',
            bg: 'bg-rose-50',
            onClick: () => openWindow('resume'),
        },
        {
            id: 'about',
            name: 'About Me',
            icon: '/images/txt.webp',
            bg: 'bg-amber-50',
            onClick: handleOpenAbout,
        },
        {
            id: 'contact',
            name: 'Contact',
            icon: '/images/contact.webp',
            bg: 'bg-[#222]',
            onClick: () => openWindow('contact'),
        },
    ];

    // Secondary Apps & Shortcuts for Page 2
    const page2Apps = [
        {
            id: 'github',
            name: 'GitHub',
            icon: '/icons/github.svg',
            iconClass: 'invert',
            bg: 'bg-gradient-to-tr from-gray-900 to-gray-700',
            onClick: () => window.open('https://github.com/mohdAsif03hy', '_blank'),
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: '/icons/linkedin.svg',
            bg: 'bg-[#0a66c2]',
            onClick: () => window.open('https://www.linkedin.com/in/mohd-asif-14a86138b', '_blank'),
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: '/icons/atom.svg',
            bg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
            onClick: () => window.open('https://www.instagram.com/asif____013/?hl=en', '_blank'),
        },
        {
            id: 'twitter',
            name: 'X',
            icon: '/icons/twitter.svg',
            bg: 'bg-black',
            onClick: () => window.open('https://x.com/', '_blank'),
        },
        {
            id: 'ecowaste',
            name: 'EcoWaste',
            renderIcon: <Leaf className='w-6 h-6 text-white stroke-[2.2] drop-shadow' />,
            bg: 'bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-emerald-500/20',
            onClick: () => handleOpenProject(0),
        },
        {
            id: 'easytalky',
            name: 'EasyTalky',
            renderIcon: <MessageSquare className='w-6 h-6 text-white stroke-[2.2] drop-shadow' />,
            bg: 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-500 shadow-indigo-500/20',
            onClick: () => handleOpenProject(1),
        },
        {
            id: 'countryinfo',
            name: 'CountryInfo',
            renderIcon: <Globe2 className='w-6 h-6 text-white stroke-[2.2] drop-shadow' />,
            bg: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-amber-500/20',
            onClick: () => handleOpenProject(2),
        },
        {
            id: 'activity-shortcut',
            name: 'Activity',
            renderIcon: <TrendingUp className='w-6 h-6 text-white stroke-[2.2] drop-shadow' />,
            bg: 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-purple-500/20',
            onClick: () => openWindow('trash'),
        },
    ];


    const dockItems = [
        {
            id: 'dock-contact',
            name: 'Contact',
            icon: '/images/contact.webp',
            badge: '1',
            onClick: () => openWindow('contact'),
        },
        {
            id: 'dock-safari',
            name: 'Articles',
            icon: '/images/safari.webp',
            onClick: () => openWindow('safari'),
        },
        {
            id: 'dock-finder',
            name: 'Projects',
            icon: '/images/finder.webp',
            onClick: handleOpenFinder,
        },
        {
            id: 'dock-github',
            name: 'GitHub',
            icon: '/icons/github.svg',
            iconClass: 'invert',
            bg: 'bg-gray-900',
            onClick: () => window.open('https://github.com/mohdAsif03hy', '_blank'),
        },
    ];

    const miniProjects = [
        {
            title: 'SwiftCart E-Commerce',
            tag: 'React • Node • Stripe (In Progress)',
            desc: 'Full-stack modern e-commerce with cart, checkout & admin panel',
            img: '/images/project-1.webp',
            comingSoon: true,
            demo: 'https://github.com/mohdAsif03hy',
            index: 3,
        },
        {
            title: 'PromptCraft AI',
            tag: 'AI • Next.js • OpenAI (In Progress)',
            desc: 'AI prompt testing playground & community sharing hub',
            img: '/images/project-2.webp',
            comingSoon: true,
            demo: 'https://github.com/mohdAsif03hy',
            index: 4,
        },
        {
            title: 'EcoWaste Platform',
            tag: 'React • Node • Express',
            desc: 'Smart waste management & pickup tracker',
            img: '/images/project-1.webp',
            demo: 'https://ecowastecom.netlify.app',
            index: 0,
        },
        {
            title: 'EasyTalky Chat',
            tag: 'Socket.io • WebRTC • Node',
            desc: 'Real-time encrypted chat & video calls',
            img: '/images/project-2.webp',
            demo: 'https://easytalky.onrender.com/',
            index: 1,
        },
        {
            title: 'Country Info Explorer',
            tag: 'React • REST API • Tailwind',
            desc: 'Global country data & demographic stats',
            img: '/images/project-3.webp',
            demo: 'https://world-country-infor.netlify.app',
            index: 2,
        },
    ];

    return (
        <div className='sm:hidden fixed inset-0 z-10 flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-purple-950/50 via-slate-950/40 to-black/70 backdrop-blur-[2px] pointer-events-auto'>
            <header className='pt-2.5 px-6 flex items-center justify-between z-20 flex-none'>
                <div className='w-16 text-left'>
                    <span className='text-sm font-semibold text-white tracking-tight drop-shadow'>
                        {currentTime || '10:53'}
                    </span>
                </div>
                <div className='h-6 w-24 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/5'>
                    <div className='w-2 h-2 rounded-full bg-emerald-500/90 animate-pulse' />
                    <div className='w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-800' />
                </div>
                <div className='w-16 flex items-center justify-end gap-1.5 text-white drop-shadow'>
                    <Signal className='w-3.5 h-3.5 fill-current stroke-none' />
                    <Wifi className='w-3.5 h-3.5' />
                    <div className='flex items-center gap-0.5 bg-white/20 backdrop-blur-md px-1 py-0.5 rounded-full border border-white/20'>
                        <span className='text-[10px] font-mono font-medium leading-none'>89%</span>
                        <Battery className='w-3.5 h-3.5 fill-white stroke-none' />
                    </div>
                </div>
            </header>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className='flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-none min-h-0 touch-pan-x'
                style={{ scrollBehavior: 'smooth' }}
            >
                <div className='w-full flex-none snap-center flex flex-col justify-between px-5 pt-3 pb-1 overflow-y-auto min-h-0'>
                    <div className='flex flex-col items-center flex-none'>
                        <div
                            onClick={handleOpenAbout}
                            className='w-full bg-gradient-to-br from-slate-900/90 via-indigo-950/85 to-slate-950/95 backdrop-blur-xl border border-white/20 rounded-[26px] p-3.5 shadow-2xl text-white cursor-pointer active:scale-[0.98] transition-transform duration-200'
                        >
                            <div className='flex items-center justify-between mb-2.5'>
                                <div className='flex items-center gap-1 text-[11px] text-indigo-300 font-medium'>
                                    <MapPin className='w-3 h-3 text-indigo-400' />
                                    <span>Hyderabad, IN</span>
                                </div>
                                <div className='flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-medium text-emerald-300'>
                                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                                    <span>Open to Work</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 mb-2.5'>
                                <div className='relative'>
                                    <img
                                        src='/images/adrian.webp'
                                        alt='Mohd Asif'
                                        className='w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-md'
                                    />
                                    <span className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <h2 className='text-sm font-bold text-white tracking-tight truncate'>
                                        Mohd Asif
                                    </h2>
                                    <p className='text-xs text-indigo-200/90 font-medium truncate'>
                                        Full Stack Developer
                                    </p>
                                    <p className='text-[10px] text-gray-300 truncate mt-0.5'>
                                        React.js • Node.js • Express.js • MongoDB
                                    </p>
                                </div>
                            </div>
                            <div className='grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10'>
                                <div className='bg-white/5 rounded-xl p-1.5 text-center flex flex-col items-center justify-center'>
                                    <span className='text-[11px] font-bold text-white leading-tight'>{liveStats.repos}+</span>
                                    <span className='text-[9px] text-indigo-300 mt-0.5'>Repos</span>
                                </div>
                                <div className='bg-white/5 rounded-xl p-1.5 text-center flex flex-col items-center justify-center'>
                                    <span className='text-[11px] font-bold text-amber-300 leading-tight'>{liveStats.totalSolved}+</span>
                                    <span className='text-[9px] text-indigo-300 mt-0.5'>LeetCode</span>
                                </div>
                                <div className='bg-white/5 rounded-xl p-1.5 text-center flex flex-col items-center justify-center'>
                                    <span className='text-[11px] font-bold text-emerald-300 leading-tight'>{liveStats.totalCommits}</span>
                                    <span className='text-[9px] text-indigo-300 mt-0.5'>Commits</span>
                                </div>
                                <div className='bg-white/5 rounded-xl p-1.5 text-center flex flex-col items-center justify-center'>
                                    <span className='text-[11px] font-bold text-sky-300 leading-tight'>{liveStats.streak}</span>
                                    <span className='text-[9px] text-indigo-300 mt-0.5'>Streak</span>
                                </div>
                            </div>
                        </div>
                        <span className='text-[10px] font-medium text-white/70 mt-1 drop-shadow'>
                            Mohd Asif • Profile
                        </span>
                    </div>
                    <div className='grid grid-cols-4 gap-x-4 gap-y-3 my-auto py-1'>
                        {page1Apps.map((app) => (
                            <div
                                key={app.id}
                                onClick={app.onClick}
                                className='flex flex-col items-center group cursor-pointer active:scale-90 transition-transform duration-150'
                            >
                                <div
                                    className={`w-14 h-14 ${app.bg || 'bg-white/10'} rounded-[18px] p-2.5 flex items-center justify-center shadow-lg border border-white/15 backdrop-blur-md relative overflow-hidden`}
                                >
                                    {app.renderIcon ? (
                                         app.renderIcon
                                    ) : (
                                        <img
                                            src={app.icon}
                                            alt={app.name}
                                            className={`w-full h-full object-contain ${app.iconClass || ''}`}
                                        />
                                    )}
                                    <div className='absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none' />
                                </div>
                                <span className='text-[11px] font-medium text-white text-center mt-1 truncate w-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'>
                                    {app.name}
                                </span>

                            </div>
                        ))}
                    </div>
                    <div className='text-center text-[10px] text-white/50 pb-0.5'>
                        Swipe left for Projects & Live Stats ›
                    </div>
                </div>

                <div className='w-full flex-none snap-center flex flex-col justify-between px-5 pt-3 pb-1 overflow-y-auto min-h-0'>
                    <div
                        onClick={() => openWindow('trash')}
                        className='w-full bg-gradient-to-br from-gray-950/90 via-slate-900/90 to-indigo-950/90 backdrop-blur-xl border border-white/20 rounded-[26px] p-3.5 shadow-2xl text-white cursor-pointer active:scale-[0.98] transition-transform duration-200'
                    >
                        <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center gap-1.5'>
                                <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                                <span className='text-[11px] font-semibold text-emerald-300'>Live Activity & Rating</span>
                            </div>
                            <span className='text-[10px] text-indigo-300 flex items-center gap-0.5'>
                                Full Charts <ChevronRight className='w-3 h-3' />
                            </span>
                        </div>
                        <div className='grid grid-cols-2 gap-2 mb-2'>
                            <div className='bg-white/5 border border-amber-500/20 rounded-xl p-2'>
                                <div className='flex items-center justify-between text-amber-300 text-[10px] font-medium'>
                                    <span className='flex items-center gap-1'>
                                        <Trophy className='w-3 h-3' /> LeetCode
                                    </span>
                                    <span className='bg-amber-500/20 px-1 py-0.5 rounded text-[9px] font-bold'>{liveStats.ranking}</span>
                                </div>
                                <div className='text-xs font-bold text-white mt-1'>{liveStats.totalSolved} Solved</div>
                                <div className='text-[9px] text-gray-400'>Easy {liveStats.easySolved} • Med {liveStats.mediumSolved} • Hard {liveStats.hardSolved}</div>
                            </div>
                            <div className='bg-white/5 border border-emerald-500/20 rounded-xl p-2'>
                                <div className='flex items-center justify-between text-emerald-300 text-[10px] font-medium'>
                                    <span className='flex items-center gap-1'>
                                        <GitCommit className='w-3 h-3' /> GitHub
                                    </span>
                                    <span className='bg-emerald-500/20 px-1 py-0.5 rounded text-[9px] font-bold'>{liveStats.repos}+ Repos</span>
                                </div>
                                <div className='text-xs font-bold text-white mt-1'>{liveStats.totalCommits} Commits</div>
                                <div className='text-[9px] text-gray-400'>16-Week Velocity Curve</div>
                            </div>
                        </div>
                        <div className='h-7 w-full bg-white/5 rounded-lg overflow-hidden flex items-center px-1'>
                            <svg viewBox='0 0 100 20' className='w-full h-full stroke-emerald-400 fill-none stroke-[2]'>
                                <path d='M 0,16 Q 15,14 25,10 T 50,7 T 75,12 T 100,3' />
                            </svg>
                        </div>
                    </div>
                    <div className='my-2 -mx-1'>
                        <div className='flex items-center justify-between mb-2 px-1'>
                            <div className='flex items-center gap-1.5'>
                                <div className='w-5 h-5 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center'>
                                    <Folder className='w-3 h-3 text-amber-400' />
                                </div>
                                <span className='text-xs font-bold text-white tracking-tight'>
                                    Featured Projects
                                </span>
                            </div>
                            <button
                                type='button'
                                onClick={handleOpenFinder}
                                className='text-[10px] text-indigo-300 font-medium flex items-center gap-0.5 hover:text-white transition-colors cursor-pointer'
                            >
                                View All (5) <ChevronRight className='w-3 h-3' />
                            </button>
                        </div>
                        <div className='flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none px-1 pb-2 pt-0.5 touch-pan-x'>
                            {miniProjects.map((p) => (
                                <div
                                    key={p.title}
                                    className='w-[225px] flex-none snap-start bg-gradient-to-br from-slate-900/95 via-indigo-950/90 to-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-[22px] p-3 shadow-xl flex flex-col justify-between hover:border-white/35 transition-all duration-200'
                                >
                                    <div>
                                        <div className='flex items-center gap-2.5 mb-2'>
                                            <div className='relative w-10 h-10 rounded-[14px] overflow-hidden bg-white/10 ring-1 ring-white/25 flex-shrink-0 shadow-md'>
                                                <img
                                                    src={p.img}
                                                    alt={p.title}
                                                    className='w-full h-full object-cover'
                                                />
                                                {p.comingSoon && (
                                                    <span className='absolute inset-0 bg-black/40 flex items-center justify-center text-[7.5px] font-black text-amber-300'>
                                                        SOON
                                                    </span>
                                                )}
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <div className='flex items-center gap-1'>
                                                    <h4 className='text-xs font-bold text-white truncate tracking-tight'>{p.title}</h4>
                                                    {p.comingSoon && (
                                                        <span className='bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[7.5px] font-bold px-1 rounded'>
                                                            Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <span className='text-[9px] font-medium text-indigo-300 block truncate mt-0.5'>{p.tag}</span>
                                            </div>
                                        </div>
                                        <p className='text-[10px] text-slate-300 leading-snug line-clamp-2 mb-2.5'>
                                            {p.desc}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2 pt-1 border-t border-white/10'>
                                        <button
                                            type='button'
                                            onClick={() => handleOpenProject(p.index)}
                                            className='flex-1 bg-white/15 hover:bg-white/25 text-white text-[10px] font-semibold py-1.5 rounded-xl border border-white/20 active:scale-95 transition-all text-center cursor-pointer'
                                        >
                                            Explore
                                        </button>
                                        {p.comingSoon ? (
                                            <span className='bg-amber-500/25 text-amber-300 text-[10px] font-semibold px-2.5 py-1.5 rounded-xl border border-amber-400/40'>
                                                Coming Soon
                                            </span>
                                        ) : (
                                            <a
                                                href={p.demo}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 text-[10px] font-semibold px-2.5 py-1.5 rounded-xl border border-emerald-400/40 flex items-center gap-1 active:scale-95 transition-all cursor-pointer'
                                            >
                                                <span>Demo</span>
                                                <ExternalLink className='w-2.5 h-2.5' />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-x-4 gap-y-2.5 py-0.5'>
                        {page2Apps.map((app) => (
                            <div
                                key={app.id}
                                onClick={app.onClick}
                                className='flex flex-col items-center group cursor-pointer active:scale-90 transition-transform duration-150'
                            >
                                <div
                                    className={`w-12 h-12 ${app.bg || 'bg-white/10'} rounded-[16px] p-2 flex items-center justify-center shadow-lg border border-white/15 backdrop-blur-md relative overflow-hidden`}
                                >
                                    {app.renderIcon ? (
                                        app.renderIcon
                                    ) : (
                                        <img
                                            src={app.icon}
                                            alt={app.name}
                                            className={`w-full h-full object-contain ${app.iconClass || ''}`}
                                        />
                                    )}
                                    <div className='absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none' />
                                </div>
                                <span className='text-[10px] font-medium text-white text-center mt-1 truncate w-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'>
                                    {app.name}
                                </span>

                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-center gap-1.5 my-1 flex-none'>
                <div className='flex items-center gap-1.5 py-0.5'>
                    <button
                        type='button'
                        onClick={() => scrollToPage(0)}
                        className={`transition-all duration-300 rounded-full ${
                            currentPage === 0 ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                        }`}
                        aria-label='Page 1'
                    />
                    <button
                        type='button'
                        onClick={() => scrollToPage(1)}
                        className={`transition-all duration-300 rounded-full ${
                            currentPage === 1 ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                        }`}
                        aria-label='Page 2'
                    />
                </div>
                <button
                    type='button'
                    onClick={handleOpenFinder}
                    className='bg-black/35 backdrop-blur-md px-4 py-1 rounded-full text-white/90 text-xs font-medium flex items-center gap-1.5 shadow border border-white/10 active:bg-black/50 transition-colors'
                >
                    <Search className='w-3 h-3 text-white/80' />
                    <span>Search</span>
                </button>
            </div>

            <div className='px-4 pb-2 flex-none'>
                <div className='bg-white/20 backdrop-blur-2xl rounded-[32px] p-2.5 px-4 flex justify-around items-center border border-white/25 shadow-2xl'>
                    {dockItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={item.onClick}
                            className='relative flex flex-col items-center cursor-pointer active:scale-90 transition-transform duration-150'
                        >
                            <div
                                className={`w-14 h-14 ${item.bg || 'bg-white/10'} rounded-[18px] p-2.5 flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md relative overflow-hidden`}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className={`w-full h-full object-contain ${item.iconClass || ''}`}
                                />
                                <div className='absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none' />
                            </div>
                            {item.badge && (
                                <span className='absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white/60 shadow-md'>
                                    {item.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <div className='w-32 h-1 bg-white/70 rounded-full mx-auto mt-2' />
            </div>
        </div>
    );
};

export default IPhoneHome;
