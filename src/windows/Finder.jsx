import { WindowControlls } from '#components';
import { locations } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import useLocationStore from '#store/location';
import { Search, ChevronLeft, ExternalLink, Clock } from 'lucide-react';
import React, { useState } from 'react';
import clsx from 'clsx';
import useWindowStore from '#store/window';

const Finder = () => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);

    const categories = [
        { id: 'work', name: '📁 Projects', loc: locations.work },
        { id: 'p1', name: '🌱 EcoWaste', loc: locations.work?.children?.[0] },
        { id: 'p2', name: '💬 EasyTalky', loc: locations.work?.children?.[1] },
        { id: 'p3', name: '🌍 CountryInfo', loc: locations.work?.children?.[2] },
        { id: 'p4', name: '🛍️ E-Commerce (Soon)', loc: locations.work?.children?.[3] },
        { id: 'p5', name: '🤖 PromptCraft (Soon)', loc: locations.work?.children?.[4] },
        { id: 'about', name: '👤 About Me', loc: locations.about },
        { id: 'resume', name: '📄 Resume', loc: locations.resume },
        { id: 'trash', name: '📦 Trash', loc: locations.trash },
    ];

    const renderList = (name, items) => (
        <div>
            <h3>{name}</h3>
            <ul>
                {items.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => {
                            setActiveLocation(item);
                            setSearchQuery('');
                        }}
                        className={clsx(item.id === activeLocation?.id ? 'active' : 'not-active')}
                    >
                        <img src={item.icon} alt={item.name} className='w-4' />
                        <p className='text-sm font-medium truncate flex-1'>{item.name}</p>
                        {item.comingSoon && (
                            <span className='text-[8px] font-bold text-amber-600 bg-amber-100 px-1 py-0.2 rounded'>
                                Soon
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );

    const openItem = (item) => {
        if (item.fileType === 'pdf') return openWindow('resume');
        if (item.kind === 'folder') return setActiveLocation(item);
        if (item.fileType && item.href) return window.open(item.href, '_blank');
        openWindow(`${item.fileType}${item.kind}`, item);
    };

    const isSubFolder = activeLocation?.kind === 'folder' && activeLocation?.id !== locations.work.id;

    const itemsToDisplay = (activeLocation?.children ?? []).filter((item) => {
        if (!searchQuery.trim()) return true;
        return (item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Featured projects data for horizontal swipe cards
    const projectCards = [
        {
            title: 'SwiftCart E-Commerce Platform',
            tag: 'React • Node • Express • Stripe',
            desc: 'Full-stack modern E-Commerce app with dynamic catalog, cart, Stripe checkout & admin dashboard.',
            img: '/images/project-1.webp',
            comingSoon: true,
            folder: locations.work?.children?.[3],
        },
        {
            title: 'PromptCraft AI Platform',
            tag: 'AI Engineering • Next.js • OpenAI API',
            desc: 'AI prompt discovery & engineering platform to test, remix, and share high-performing LLM prompts.',
            img: '/images/project-2.webp',
            comingSoon: true,
            folder: locations.work?.children?.[4],
        },
        {
            title: 'Waste Management System (EcoWaste)',
            tag: 'Sustainability • React • Node.js',
            desc: 'Smart platform for clean and sustainable waste handling with interactive tracking.',
            img: '/images/project-1.webp',
            demo: 'https://ecowastecom.netlify.app',
            folder: locations.work?.children?.[0],
        },
        {
            title: 'EasyTalky Real-Time Chat',
            tag: 'WebRTC • MERN • Socket.io',
            desc: 'Real-time chat & video call app with customizable dark UI, reactions, and authentication.',
            img: '/images/project-2.webp',
            demo: 'https://easytalky.onrender.com/',
            folder: locations.work?.children?.[1],
        },
        {
            title: 'World Country Info Explorer',
            tag: 'REST API • JavaScript • UI',
            desc: 'Responsive web application exploring global country data, demographics, and flags.',
            img: '/images/project-3.webp',
            demo: 'https://world-country-infor.netlify.app',
            folder: locations.work?.children?.[2],
        },
    ];

    return (
        <>
            <div id='window-header'>
                <WindowControlls target='finder' />
                <div className='flex items-center gap-2'>
                    {showSearchInput ? (
                        <div className='flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded border border-gray-200'>
                            <Search className='w-3 h-3 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search in Finder...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='text-xs bg-transparent outline-none w-28 text-gray-700'
                                autoFocus
                            />
                        </div>
                    ) : null}
                    <Search
                        className='icon cursor-pointer'
                        onClick={() => setShowSearchInput(!showSearchInput)}
                    />
                </div>
            </div>

            {/* 📱 Mobile Top Horizontal Scrollable Category Bar */}
            <div className='sm:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100/80 border-b border-gray-200 overflow-x-auto scrollbar-none flex-none select-none'>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type='button'
                        onClick={() => {
                            if (cat.loc) setActiveLocation(cat.loc);
                            setSearchQuery('');
                        }}
                        className={clsx(
                            'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-none',
                            activeLocation?.id === cat.loc?.id
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                        )}
                    >
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            <div className='bg-white flex flex-1 h-full overflow-hidden'>
                {/* Desktop Sidebar */}
                <div className='sidebar flex-none max-sm:hidden'>
                    {renderList('Favorites', Object.values(locations))}
                    {renderList('Work', locations.work.children)}
                </div>

                <div className='flex-1 flex flex-col h-full overflow-hidden'>
                    {/* Subfolder Breadcrumb on Mobile / Desktop */}
                    {isSubFolder ? (
                        <div className='px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between flex-none'>
                            <button
                                type='button'
                                onClick={() => setActiveLocation(locations.work)}
                                className='flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline active:opacity-60 cursor-pointer'
                            >
                                <ChevronLeft className='w-4 h-4' />
                                <span>All Projects</span>
                            </button>
                            <div className='flex items-center gap-2'>
                                <span className='text-xs text-gray-700 font-medium truncate max-w-[200px]'>
                                    📁 {activeLocation.name}
                                </span>
                                {activeLocation.comingSoon && (
                                    <span className='bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-amber-300'>
                                        Coming Soon
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : null}

                    <div className='flex-1 overflow-y-auto p-3 space-y-4'>
                        {/* 📱 Left-Right Horizontal Swipeable Featured Project Cards Carousel (when at Work root) */}
                        {activeLocation?.id === locations.work.id && !searchQuery.trim() && (
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between px-1'>
                                    <h3 className='text-xs font-bold text-gray-800 flex items-center gap-1.5'>
                                        <span>🌟 Featured Projects</span>
                                        <span className='text-[10px] text-gray-400 font-normal'>(Swipe left/right)</span>
                                    </h3>
                                </div>

                                <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory'>
                                    {projectCards.map((proj, idx) => (
                                        <div
                                            key={idx}
                                            className='flex-none w-[240px] sm:w-[260px] bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-3 shadow-md snap-start flex flex-col justify-between border border-white/10'
                                        >
                                            <div>
                                                <div className='relative h-28 w-full rounded-xl overflow-hidden mb-2 bg-black/40'>
                                                    <img
                                                        src={proj.img}
                                                        alt={proj.title}
                                                        className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                                                    />
                                                    {proj.comingSoon && (
                                                        <span className='absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md border border-white/70'>
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className='text-xs font-bold text-white truncate' title={proj.title}>
                                                    {proj.title}
                                                </h4>
                                                <p className='text-[9px] text-indigo-300 font-medium truncate mb-1'>
                                                    {proj.tag}
                                                </p>
                                                <p className='text-[10px] text-gray-300 line-clamp-2 leading-relaxed'>
                                                    {proj.desc}
                                                </p>
                                            </div>

                                            <div className='flex items-center gap-2 pt-2.5 mt-2 border-t border-white/10'>
                                                {proj.folder && (
                                                    <button
                                                        type='button'
                                                        onClick={() => setActiveLocation(proj.folder)}
                                                        className='flex-1 py-1 px-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[10px] font-medium transition-colors text-center cursor-pointer'
                                                    >
                                                        Explore Files
                                                    </button>
                                                )}
                                                {proj.comingSoon ? (
                                                    <span className='py-1 px-2.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/40 flex items-center gap-1'>
                                                        <Clock className='w-2.5 h-2.5' />
                                                        <span>Soon</span>
                                                    </span>
                                                ) : proj.demo ? (
                                                    <a
                                                        href={proj.demo}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold transition-colors flex items-center gap-1 text-center'
                                                    >
                                                        <span>Live</span>
                                                        <ExternalLink className='w-2.5 h-2.5' />
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files and Folders Grid */}
                        <div>
                            <h3 className='text-xs font-semibold text-gray-600 mb-2 px-1'>
                                {activeLocation?.name} Contents ({itemsToDisplay.length})
                            </h3>
                            <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 p-1'>
                                {itemsToDisplay.map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => openItem(item)}
                                        className='cursor-pointer p-3 rounded-xl bg-gray-50/90 hover:bg-blue-50/80 border border-gray-200/90 hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 shadow-xs group relative'
                                    >
                                        <div className='relative'>
                                            <img src={item.icon} alt={item.name} className='w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-200' />
                                            {item.comingSoon && (
                                                <span className='absolute -top-1 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-[7.5px] px-1.5 py-0.2 rounded-full shadow border border-white/80'>
                                                    Soon
                                                </span>
                                            )}
                                        </div>
                                        <p className='text-xs font-medium text-gray-800 truncate w-full'>
                                            {item.name}
                                        </p>
                                        {item.comingSoon && (
                                            <span className='text-[8.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full border border-amber-200'>
                                                Coming Soon
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const FinderWindow = WindowWrapper(Finder, 'finder');

export default FinderWindow;
