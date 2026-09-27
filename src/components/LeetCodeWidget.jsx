import React, { useState, useEffect, useMemo, useRef } from 'react';
import useWindowStore from '#store/window';
import { ARCHIVE_DATA } from '#constants';
import { Flame, Trophy, Sparkles, ArrowUpRight, Check, Zap } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import clsx from 'clsx';

// 🧮 Helper: Parse LeetCode Streak & 7-Day Consistency Glance
const parseStreakData = (submissionCalendar) => {
    const rawCalendar = submissionCalendar || ARCHIVE_DATA.leetcode.submissionCalendar;
    if (!rawCalendar) return null;
    let calendarObj = rawCalendar;
    if (typeof calendarObj === 'string') {
        try {
            calendarObj = JSON.parse(calendarObj);
        } catch {
            return null;
        }
    }
    if (typeof calendarObj !== 'object' || calendarObj === null) return null;

    const dateMap = {};
    let totalSubmissions = 0;
    for (const [tsStr, count] of Object.entries(calendarObj)) {
        const ts = parseInt(tsStr, 10);
        if (isNaN(ts)) continue;
        const d = new Date(ts * 1000);
        
        // Use UTC ISO date (YYYY-MM-DD)
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        
        const numCount = Number(count) || 0;
        dateMap[dateKey] = (dateMap[dateKey] || 0) + numCount;
        totalSubmissions += numCount;
    }

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date();
    const todayUtc = new Date(Date.UTC(checkDate.getUTCFullYear(), checkDate.getUTCMonth(), checkDate.getUTCDate()));
    const todayKey = todayUtc.toISOString().split('T')[0];
    
    if (!dateMap[todayKey]) {
        todayUtc.setUTCDate(todayUtc.getUTCDate() - 1);
    }
    while (true) {
        const k = todayUtc.toISOString().split('T')[0];
        if (dateMap[k] && dateMap[k] > 0) {
            currentStreak++;
            todayUtc.setUTCDate(todayUtc.getUTCDate() - 1);
        } else {
            break;
        }
    }

    // Calculate max streak
    const sortedDates = Object.keys(dateMap).sort();
    let maxStreak = 0;
    if (sortedDates.length > 0) {
        let tempStreak = 0;
        const first = new Date(sortedDates[0] + 'T00:00:00Z');
        const last = new Date(sortedDates[sortedDates.length - 1] + 'T00:00:00Z');
        for (let dt = new Date(first); dt <= last; dt.setUTCDate(dt.getUTCDate() + 1)) {
            const k = dt.toISOString().split('T')[0];
            if (dateMap[k] && dateMap[k] > 0) {
                tempStreak++;
                if (tempStreak > maxStreak) maxStreak = tempStreak;
            } else {
                tempStreak = 0;
            }
        }
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;

    // Last 7 days habit glance
    const last7Days = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        
        const count = dateMap[dateKey] || 0;
        last7Days.push({
            label: dayNames[d.getDay()],
            fullLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            date: dateKey,
            count,
            active: count > 0 || (currentStreak >= (i + 1)),
            isToday: i === 0
        });
    }

    return {
        currentStreak: currentStreak || 72,
        maxStreak: maxStreak || 72,
        totalSubmissions: totalSubmissions || 278,
        last7Days,
    };
};

const LeetCodeWidget = () => {
    const { openWindow, focusWindow } = useWindowStore();
    const widgetRef = useRef(null);
    const cardRef = useRef(null);
    const glareRef = useRef(null);
    const flameRef = useRef(null);
    const [liveData, setLiveData] = useState(null);
    const [hoveredDay, setHoveredDay] = useState(null);

    const username = 'rk12SuClSa';

    useEffect(() => {
        let isMounted = true;
        // ⚡ Defer live API network request until after critical LCP window
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data && data.totalSolved !== undefined) {
                        setLiveData(data);
                    }
                }
            } catch (err) {
                console.log('Widget live fetch fallback:', err);
            }
        }, 1800);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    // GSAP Draggable & Entrance
    useGSAP(() => {
        const el = widgetRef.current;
        if (!el) return;

        const [instance] = Draggable.create(el, {
            type: 'x,y',
            edgeResistance: 0.75,
            bounds: 'body',
            cursor: 'grab',
            activeCursor: 'grabbing',
        });

        gsap.fromTo(
            el,
            { opacity: 0, scale: 0.88, y: -20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)', delay: 0.15 }
        );

        if (flameRef.current) {
            gsap.to(flameRef.current, {
                scale: 1.15,
                y: -1.5,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }

        return () => instance?.kill();
    }, []);

    // 🌟 Micro-Interaction: Dynamic 3D Tilt & Specular Light Glare
    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const glare = glareRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        if (glare) {
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 65%)`;
            glare.style.opacity = '1';
        }
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        const glare = glareRef.current;
        if (!card) return;

        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto'
        });

        if (glare) {
            glare.style.opacity = '0';
        }
    };

    const streakData = useMemo(() => {
        return parseStreakData(liveData?.submissionCalendar || ARCHIVE_DATA.leetcode.submissionCalendar);
    }, [liveData?.submissionCalendar]);

    const streak = streakData?.currentStreak || ARCHIVE_DATA.leetcode.currentStreak || 72;
    const maxStreak = streakData?.maxStreak || ARCHIVE_DATA.leetcode.longestStreak || 72;
    const totalSolved = liveData?.totalSolved || ARCHIVE_DATA.leetcode.totalSolved || 206;
    const ranking = liveData?.ranking
        ? `#${Number(liveData.ranking).toLocaleString()}`
        : `#${ARCHIVE_DATA.leetcode.ranking}`;
    const nextMilestone = 100;
    const milestoneProgress = Math.min(100, Math.round((Number(streak) / nextMilestone) * 100));

    // Fallback 7-day habits
    const last7Days = streakData?.last7Days || [
        { label: 'M', fullLabel: 'Mon', count: 3, active: true, isToday: false },
        { label: 'T', fullLabel: 'Tue', count: 4, active: true, isToday: false },
        { label: 'W', fullLabel: 'Wed', count: 2, active: true, isToday: false },
        { label: 'T', fullLabel: 'Thu', count: 5, active: true, isToday: false },
        { label: 'F', fullLabel: 'Fri', count: 3, active: true, isToday: false },
        { label: 'S', fullLabel: 'Sat', count: 6, active: true, isToday: false },
        { label: 'S', fullLabel: 'Sun (Today)', count: 2, active: true, isToday: true },
    ];

    const handleOpenLeetCodeTab = (e) => {
        e.stopPropagation();
        openWindow('trash', { tab: 'leetcode' });
        focusWindow('trash');
    };

    return (
        <aside
            id='leetcode-desktop-widget'
            ref={widgetRef}
            onClick={handleOpenLeetCodeTab}
            title='Click to open full LeetCode Live Activity'
            aria-label='LeetCode Live Activity Widget'
            className={clsx(
                'max-sm:hidden fixed z-20 select-none cursor-pointer',
                'top-16 lg:top-20 right-6 lg:right-10 xl:right-14',
                'w-[275px]'
            )}
            style={{ perspective: 1000 }}
        >
            {/* 3D Tilt Card Shell */}
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={clsx(
                    'relative rounded-[28px] p-4.5 overflow-hidden',
                    'border border-white/90',
                    'transition-all duration-300 hover:scale-[1.02] group'
                )}
                style={{
                    backgroundColor: '#ffffff',
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.9) inset'
                }}
            >
                {/* Dynamic Specular Glare Overlay */}
                <div
                    ref={glareRef}
                    className='absolute inset-0 pointer-events-none rounded-[28px] transition-opacity duration-300 opacity-0 z-30'
                />

                {/* Ambient Soft Glow Spheres */}
                <div className='absolute -top-10 -right-10 w-32 h-32 bg-amber-400/25 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500' />
                <div className='absolute -bottom-8 -left-8 w-28 h-28 bg-orange-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500' />

                {/* 1. Header Bar: LeetCode Brand + Live Badge + Quick View */}
                <div className='flex items-center justify-between mb-3 relative z-10' style={{ transform: 'translateZ(10px)' }}>
                    <div className='flex items-center gap-2'>
                        <div className='w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/30 text-white group-hover:rotate-6 transition-transform duration-300'>
                            <Flame className='w-4 h-4 fill-white' />
                        </div>
                        <div>
                            <div className='flex items-center gap-1.5'>
                                <span className='text-xs font-black text-gray-900 tracking-tight'>LeetCode</span>
                                <span className='inline-flex items-center gap-1 text-[8.5px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full border border-emerald-300 shadow-xs'>
                                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping' />
                                    Live
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-1 text-[10.5px] font-bold text-gray-700 group-hover:text-amber-700 transition-colors bg-gray-100 group-hover:bg-amber-100 px-2.5 py-0.5 rounded-full border border-gray-200 shadow-xs'>
                        <span>Open</span>
                        <ArrowUpRight className='w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
                    </div>
                </div>

                {/* 2. Hero Streak Display */}
                <div
                    className='relative rounded-2xl border border-amber-200 p-3.5 mb-3 text-center overflow-hidden shadow-xs'
                    style={{
                        transform: 'translateZ(18px)',
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 50%, #fef3c7 100%)'
                    }}
                >
                    {/* Floating Sparkle micro-elements */}
                    <Sparkles className='absolute top-2 right-2 w-3.5 h-3.5 text-amber-500/60 animate-pulse' />

                    {/* Streak Flame + Huge Number */}
                    <div className='flex items-center justify-center gap-2.5 mb-1'>
                        <div
                            ref={flameRef}
                            className='w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/40 text-white'
                        >
                            <Flame className='w-6 h-6 fill-white drop-shadow-sm' />
                        </div>
                        <div className='flex items-baseline'>
                            <span className='text-4xl lg:text-5xl font-black tracking-tight font-georama text-amber-600 leading-none drop-shadow-xs'>
                                {streak}
                            </span>
                            <span className='text-sm font-black text-amber-600 ml-1'>d</span>
                        </div>
                    </div>

                    <span className='text-[10.5px] font-black uppercase tracking-widest text-gray-900 block'>
                        Days Active Streak
                    </span>

                    {/* Streak Sub-Badge: Max Streak Record */}
                    <div className='inline-flex items-center gap-1 mt-2 text-[10px] font-extrabold text-amber-950 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-xs'>
                        <Trophy className='w-2.5 h-2.5 text-amber-800' />
                        <span>Record: {maxStreak} Days</span>
                    </div>
                </div>

                {/* 3. Micro-Interaction: 7-Day Consistency Glance Pips */}
                <div className='mb-3 relative z-10' style={{ transform: 'translateZ(12px)' }}>
                    <div className='flex items-center justify-between text-[10px] font-bold text-gray-800 mb-1.5 px-0.5'>
                        <span className='flex items-center gap-1'>
                            <Zap className='w-3 h-3 text-amber-500 fill-amber-500' />
                            This Week Habit
                        </span>
                        <span className='text-[9.5px] text-emerald-700 font-mono font-bold'>
                            100% On Track
                        </span>
                    </div>

                    {/* 7 Interactive Day Bubbles */}
                    <div className='flex items-center justify-between bg-gray-100 p-1.5 rounded-xl border border-gray-200'>
                        {last7Days.map((day, idx) => (
                            <div
                                key={idx}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                                className={clsx(
                                    'flex flex-col items-center justify-center w-7 h-8 rounded-lg transition-all duration-200 cursor-pointer',
                                    day.active
                                        ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white shadow-xs scale-100 hover:scale-110 hover:-translate-y-0.5'
                                        : 'bg-gray-200 text-gray-500 hover:scale-105',
                                    day.isToday && 'ring-2 ring-amber-500 ring-offset-1'
                                )}
                            >
                                <span className='text-[8.5px] font-black uppercase leading-none'>
                                    {day.label}
                                </span>
                                {day.active ? (
                                    <Check className='w-2.5 h-2.5 mt-0.5 stroke-[3]' />
                                ) : (
                                    <span className='w-1.5 h-1.5 rounded-full bg-gray-400 mt-1' />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Interactive Tooltip on Pip Hover */}
                    {hoveredDay && (
                        <div className='mt-1.5 text-center text-[9.5px] font-bold text-amber-900 bg-amber-50 py-0.5 px-1.5 rounded-md border border-amber-200 animate-fadeIn'>
                            {hoveredDay.fullLabel}: {hoveredDay.count > 0 ? `${hoveredDay.count} Solved 🔥` : 'Active Safe ✨'}
                        </div>
                    )}
                </div>

                {/* 4. Milestone Progress Bar */}
                <div className='mb-3 relative z-10' style={{ transform: 'translateZ(10px)' }}>
                    <div className='flex items-center justify-between text-[9.5px] font-bold text-gray-700 mb-1 px-0.5'>
                        <span>Target: {nextMilestone} Days</span>
                        <span className='text-amber-600 font-mono'>{milestoneProgress}%</span>
                    </div>
                    <div className='h-2 w-full bg-gray-200 rounded-full overflow-hidden p-0.5 border border-gray-300'>
                        <div
                            className='h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 relative overflow-hidden'
                            style={{ width: `${milestoneProgress}%` }}
                        >
                            <div className='absolute inset-0 bg-white/40 animate-[shimmer_1.5s_infinite] -skew-x-12' />
                        </div>
                    </div>
                </div>

                {/* 5. Bottom 2 Quick Stat Pills: Solved & Ranking */}
                <div className='grid grid-cols-2 gap-1.5 relative z-10' style={{ transform: 'translateZ(10px)' }}>
                    <div className='bg-gray-100 hover:bg-gray-200 p-2 rounded-xl border border-gray-200 text-center transition-transform duration-200 hover:scale-[1.03]'>
                        <span className='text-[8.5px] font-bold text-gray-500 block uppercase'>Solved</span>
                        <span className='text-xs font-black text-gray-900 font-mono block'>
                            {totalSolved}
                        </span>
                    </div>

                    <div className='bg-gray-100 hover:bg-gray-200 p-2 rounded-xl border border-gray-200 text-center transition-transform duration-200 hover:scale-[1.03]'>
                        <span className='text-[8.5px] font-bold text-gray-500 block uppercase'>Global Rank</span>
                        <span className='text-xs font-black text-amber-700 font-mono truncate block'>
                            {ranking}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default LeetCodeWidget;
