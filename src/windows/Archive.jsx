import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { WindowControlls } from '#components';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { ARCHIVE_DATA } from '#constants';
import {
    Activity,
    Code2,
    Flame,
    Trophy,
    ExternalLink,
    FolderArchive,
    CheckCircle2,
    GitCommit,
    Star,
    GitBranch,
    Calendar,
    Award,
    Sparkles,
    RefreshCw,
    Search,
    TrendingUp,
    Zap,
} from 'lucide-react';
import clsx from 'clsx';

// 📈 Interactive SVG Activity Line & Area Chart for GitHub Contributions
const GitHubActivityChart = ({ liveContributions }) => {
    const chartData = useMemo(() => {
        if (!liveContributions || liveContributions.length === 0) {
            return [
                { week: 'W1', count: 12 },
                { week: 'W2', count: 18 },
                { week: 'W3', count: 15 },
                { week: 'W4', count: 24 },
                { week: 'W5', count: 20 },
                { week: 'W6', count: 32 },
                { week: 'W7', count: 28 },
                { week: 'W8', count: 35 },
                { week: 'W9', count: 22 },
                { week: 'W10', count: 38 },
                { week: 'W11', count: 42 },
                { week: 'W12', count: 30 },
                { week: 'W13', count: 45 },
                { week: 'W14', count: 36 },
                { week: 'W15', count: 48 },
                { week: 'W16', count: 52 },
            ];
        }

        const weeks = [];
        const chunkSize = 7;
        const recent = liveContributions.slice(-112); // Last 16 weeks
        for (let i = 0; i < recent.length; i += chunkSize) {
            const chunk = recent.slice(i, i + chunkSize);
            const sum = chunk.reduce((acc, d) => acc + (d.count || 0), 0);
            const weekNum = Math.floor(i / chunkSize) + 1;
            weeks.push({
                week: `W${weekNum}`,
                count: sum,
                date: chunk[0]?.date || `Week ${weekNum}`,
            });
        }
        return weeks;
    }, [liveContributions]);

    const [hoveredPoint, setHoveredPoint] = useState(null);

    const maxCount = Math.max(...chartData.map((d) => d.count), 20);
    const width = 500;
    const height = 130;
    const padding = { top: 15, right: 20, bottom: 25, left: 30 };

    const getX = useCallback((index) => {
        return padding.left + (index / (chartData.length - 1)) * (width - padding.left - padding.right);
    }, [chartData.length, padding.left, padding.right, width]);

    const getY = useCallback((val) => {
        return height - padding.bottom - (val / maxCount) * (height - padding.top - padding.bottom);
    }, [height, maxCount, padding.bottom, padding.top]);

    const pathD = useMemo(() => {
        if (chartData.length === 0) return '';
        const points = chartData.map((d, i) => ({ x: getX(i), y: getY(d.count) }));
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? 0 : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    }, [chartData, getX, getY]);

    const areaD = useMemo(() => {
        if (!pathD) return '';
        const firstX = getX(0);
        const lastX = getX(chartData.length - 1);
        const bottomY = height - padding.bottom;
        return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
    }, [pathD, chartData.length, getX, height, padding.bottom]);

    return (
        <div className='bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-2'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <TrendingUp className='w-4 h-4 text-emerald-600' />
                    <h4 className='text-xs font-semibold text-gray-800'>GitHub Activity Velocity (16-Week Line)</h4>
                </div>
                <div className='flex items-center gap-2 text-[10px] text-gray-500'>
                    <span className='flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                        Live Trend
                    </span>
                </div>
            </div>

            <div className='relative w-full overflow-x-auto scrollbar-none'>
                <svg viewBox={`0 0 ${width} ${height}`} className='w-full min-w-[340px] h-32 select-none'>
                    <defs>
                        <linearGradient id='githubGradient' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='0%' stopColor='#10b981' stopOpacity='0.4' />
                            <stop offset='100%' stopColor='#10b981' stopOpacity='0.0' />
                        </linearGradient>
                    </defs>

                    {[0, 0.5, 1].map((ratio, idx) => {
                        const y = height - padding.bottom - ratio * (height - padding.top - padding.bottom);
                        const labelVal = Math.round(ratio * maxCount);
                        return (
                            <g key={idx}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={width - padding.right}
                                    y2={y}
                                    stroke='#f1f5f9'
                                    strokeDasharray='4 4'
                                    strokeWidth='1'
                                />
                                <text x={padding.left - 6} y={y + 3} textAnchor='end' className='text-[9px] fill-gray-400 font-mono'>
                                    {labelVal}
                                </text>
                            </g>
                        );
                    })}

                    <path d={areaD} fill='url(#githubGradient)' />
                    <path d={pathD} fill='none' stroke='#10b981' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />

                    {chartData.map((d, i) => {
                        const cx = getX(i);
                        const cy = getY(d.count);
                        const isHovered = hoveredPoint?.index === i;
                        return (
                            <g key={i} onMouseEnter={() => setHoveredPoint({ ...d, index: i, cx, cy })} onTouchStart={() => setHoveredPoint({ ...d, index: i, cx, cy })}>
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={isHovered ? 5.5 : 3}
                                    className={`${isHovered ? 'fill-emerald-600 stroke-white stroke-2' : 'fill-emerald-500 hover:fill-emerald-700'} transition-all cursor-pointer`}
                                />
                            </g>
                        );
                    })}

                    {chartData.map((d, i) => {
                        if (i % 3 !== 0 && i !== chartData.length - 1) return null;
                        return (
                            <text key={i} x={getX(i)} y={height - 6} textAnchor='middle' className='text-[9px] fill-gray-400 font-mono'>
                                {d.week}
                            </text>
                        );
                    })}
                </svg>

                {hoveredPoint && (
                    <div
                        className='absolute bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg pointer-events-none -translate-x-1/2 -translate-y-8 font-medium z-10'
                        style={{
                            left: `${(hoveredPoint.cx / width) * 100}%`,
                            top: `${(hoveredPoint.cy / height) * 100}%`,
                        }}
                    >
                        {hoveredPoint.count} commits ({hoveredPoint.week})
                    </div>
                )}
            </div>
        </div>
    );
};

const LEETCODE_RATING_DATA = [
    { label: 'Contest 1', rating: 1480, rank: 'Top 35%' },
    { label: 'Contest 4', rating: 1520, rank: 'Top 28%' },
    { label: 'Contest 8', rating: 1560, rank: 'Top 22%' },
    { label: 'Contest 12', rating: 1590, rank: 'Top 18%' },
    { label: 'Contest 16', rating: 1620, rank: 'Top 15%' },
];

// 🏆 Interactive LeetCode Contest Rating & Difficulty Curve Chart
const LeetCodeRatingChart = () => {
    const ratingData = LEETCODE_RATING_DATA;
    const [selectedPoint, setSelectedPoint] = useState(null);

    const minRating = 1450;
    const maxRating = 1680;
    const width = 500;
    const height = 120;
    const padding = { top: 15, right: 20, bottom: 25, left: 35 };

    const getX = useCallback((i) => padding.left + (i / (ratingData.length - 1)) * (width - padding.left - padding.right), [padding.left, padding.right, ratingData.length, width]);
    const getY = useCallback((val) => height - padding.bottom - ((val - minRating) / (maxRating - minRating)) * (height - padding.top - padding.bottom), [height, maxRating, minRating, padding.bottom, padding.top]);

    const pathD = useMemo(() => {
        const points = ratingData.map((d, i) => ({ x: getX(i), y: getY(d.rating) }));
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const cpx = (p1.x + p2.x) / 2;
            d += ` C ${cpx} ${p1.y}, ${cpx} ${p2.y}, ${p2.x} ${p2.y}`;
        }
        return d;
    }, [getX, getY, ratingData]);

    const areaD = useMemo(() => {
        const firstX = getX(0);
        const lastX = getX(ratingData.length - 1);
        const bottomY = height - padding.bottom;
        return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
    }, [pathD, getX, height, padding.bottom, ratingData.length]);

    return (
        <div className='bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-2'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Trophy className='w-4 h-4 text-amber-500' />
                    <h4 className='text-xs font-semibold text-gray-800'>LeetCode Rating Progress (1,620 Milestone)</h4>
                </div>
                <span className='text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200'>
                    Top 15% Global
                </span>
            </div>

            <div className='relative w-full overflow-x-auto scrollbar-none'>
                <svg viewBox={`0 0 ${width} ${height}`} className='w-full min-w-[340px] h-28 select-none'>
                    <defs>
                        <linearGradient id='leetcodeGradient' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='0%' stopColor='#f59e0b' stopOpacity='0.4' />
                            <stop offset='100%' stopColor='#f59e0b' stopOpacity='0.0' />
                        </linearGradient>
                    </defs>

                    {[1500, 1560, 1620].map((rate, idx) => {
                        const y = getY(rate);
                        return (
                            <g key={idx}>
                                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke='#f1f5f9' strokeDasharray='4 4' strokeWidth='1' />
                                <text x={padding.left - 6} y={y + 3} textAnchor='end' className='text-[9px] fill-gray-400 font-mono'>
                                    {rate}
                                </text>
                            </g>
                        );
                    })}

                    <path d={areaD} fill='url(#leetcodeGradient)' />
                    <path d={pathD} fill='none' stroke='#f59e0b' strokeWidth='2.5' strokeLinecap='round' />

                    {ratingData.map((d, i) => {
                        const cx = getX(i);
                        const cy = getY(d.rating);
                        const isSelected = selectedPoint?.label === d.label;
                        return (
                            <g key={i} onMouseEnter={() => setSelectedPoint({ ...d, cx, cy })} onTouchStart={() => setSelectedPoint({ ...d, cx, cy })}>
                                <circle cx={cx} cy={cy} r={isSelected ? 6 : 3.5} className='fill-amber-500 stroke-white stroke-2 cursor-pointer hover:fill-amber-600 transition-all' />
                            </g>
                        );
                    })}

                    {ratingData.map((d, i) => (
                        <text key={i} x={getX(i)} y={height - 6} textAnchor='middle' className='text-[9px] fill-gray-400 font-mono'>
                            {d.label}
                        </text>
                    ))}
                </svg>

                {selectedPoint && (
                    <div
                        className='absolute bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg pointer-events-none -translate-x-1/2 -translate-y-8 font-medium z-10'
                        style={{
                            left: `${(selectedPoint.cx / width) * 100}%`,
                            top: `${(selectedPoint.cy / height) * 100}%`,
                        }}
                    >
                        Rating {selectedPoint.rating} ({selectedPoint.rank})
                    </div>
                )}
            </div>
        </div>
    );
};


// 🟩 GitHub 52-Week Contribution Heatmap Component
const GitHubHeatmap = ({ liveContributions, totalContributions }) => {
    const scrollRef = useRef(null);

    const { weeks, monthLabels, totalComputed } = useMemo(() => {
        let list = liveContributions;
        if (!list || list.length === 0) {
            const fallbackDays = [];
            const now = new Date();
            for (let i = 370; i >= 0; i--) {
                const dt = new Date(now);
                dt.setDate(now.getDate() - i);
                const dateStr = dt.toISOString().split('T')[0];
                const dayOfWeek = dt.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const pseudo = ((i * 17 + dayOfWeek * 23) % 100);
                let count = 0;
                let level = 0;
                if (i < 80) {
                    count = (pseudo % 5) + 1;
                    level = count >= 4 ? 3 : (count >= 2 ? 2 : 1);
                } else if (pseudo > 40) {
                    count = (pseudo % 4) + (isWeekend ? 0 : 1);
                    level = count >= 4 ? 3 : (count >= 2 ? 2 : (count > 0 ? 1 : 0));
                }
                fallbackDays.push({ date: dateStr, count, level });
            }
            list = fallbackDays;
        }

        const dateMap = {};
        let total = 0;
        list.forEach((item) => {
            if (item && item.date) {
                dateMap[item.date] = item;
                total += (item.count || 0);
            }
        });

        const numWeeks = 52;
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (numWeeks * 7 - 1));
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        const weekCols = [];
        let currentWeek = [];
        const months = [];
        let lastMonth = -1;

        for (let i = 0; i < numWeeks * 7; i++) {
            const curr = new Date(startDate);
            curr.setDate(startDate.getDate() + i);
            const dateKey = curr.toISOString().split('T')[0];
            const found = dateMap[dateKey];
            const count = found?.count || 0;
            const level = found?.level ?? (count >= 8 ? 4 : count >= 5 ? 3 : count >= 3 ? 2 : count >= 1 ? 1 : 0);

            if (curr.getDay() === 0) {
                const m = curr.getMonth();
                if (m !== lastMonth) {
                    months.push({
                        index: Math.floor(i / 7),
                        label: curr.toLocaleString('default', { month: 'short' }),
                    });
                    lastMonth = m;
                }
            }

            currentWeek.push({
                date: dateKey,
                displayDate: curr.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                count,
                level,
            });

            if (currentWeek.length === 7) {
                weekCols.push(currentWeek);
                currentWeek = [];
            }
        }

        return {
            weeks: weekCols,
            monthLabels: months,
            totalComputed: total || 530,
        };
    }, [liveContributions]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [weeks]);

    const getColor = (level) => {
        switch (level) {
            case 1:
                return 'bg-emerald-200 hover:bg-emerald-300';
            case 2:
                return 'bg-emerald-400 hover:bg-emerald-500';
            case 3:
                return 'bg-emerald-600 hover:bg-emerald-700';
            case 4:
                return 'bg-emerald-800 hover:bg-emerald-900';
            default:
                return 'bg-gray-100 hover:bg-gray-200';
        }
    };

    const countDisplay = totalContributions || totalComputed;

    return (
        <div className='bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 select-none'>
            {/* Header */}
            <div className='flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5'>
                <div className='flex items-center gap-2'>
                    <div className='p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600'>
                        <GitCommit className='w-4 h-4' />
                    </div>
                    <div>
                        <h4 className='text-xs font-bold text-gray-800 flex items-center gap-1.5'>
                            <span>GitHub Contributions Calendar</span>
                            <span className='inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200'>
                                <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                                Live Matrix
                            </span>
                        </h4>
                        <p className='text-[10px] text-gray-500'>
                            {countDisplay} contributions in the past year
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-1.5 text-[10px] text-gray-500'>
                    <span>Less</span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-gray-100 inline-block'></span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-emerald-200 inline-block'></span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block'></span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block'></span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-emerald-800 inline-block'></span>
                    <span>More</span>
                </div>
            </div>

            {/* Heatmap Grid Section */}
            <div ref={scrollRef} className='relative w-full overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 touch-pan-x'>
                <div className='w-max min-w-[720px] pr-2'>
                    {/* Month labels header */}
                    <div className='flex text-[10px] text-gray-400 pl-7 mb-1.5 font-mono h-4 relative'>
                        {monthLabels.map((m, idx) => (
                            <span
                                key={idx}
                                className='absolute text-[10px] text-gray-500 font-medium'
                                style={{ left: `${m.index * 13.5 + 28}px` }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>

                    {/* Day Labels + Week Columns Grid */}
                    <div className='flex gap-1.5 items-start'>
                        {/* Day of Week labels */}
                        <div className='flex flex-col gap-1 text-[9px] font-mono text-gray-400 pr-1 select-none flex-none pt-0.5'>
                            <span className='h-2.5 leading-[10px]'>Sun</span>
                            <span className='h-2.5 leading-[10px] text-transparent'>Mon</span>
                            <span className='h-2.5 leading-[10px]'>Tue</span>
                            <span className='h-2.5 leading-[10px] text-transparent'>Wed</span>
                            <span className='h-2.5 leading-[10px]'>Thu</span>
                            <span className='h-2.5 leading-[10px] text-transparent'>Fri</span>
                            <span className='h-2.5 leading-[10px]'>Sat</span>
                        </div>

                        {/* Week Columns of Squares */}
                        <div className='flex gap-1 flex-1'>
                            {weeks.map((week, wIndex) => (
                                <div key={wIndex} className='flex flex-col gap-1'>
                                    {week.map((day, dIndex) => (
                                        <div
                                            key={dIndex}
                                            title={`${day.count || 0} contribution${day.count === 1 ? '' : 's'} on ${day.displayDate || day.date}`}
                                            className={`w-2.5 h-2.5 rounded-[2px] ${getColor(day.level)} hover:scale-125 transition-transform duration-100 cursor-pointer`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 🧮 Helper: Parse LeetCode Submission Calendar & Compute Streaks
const processLeetCodeCalendar = (submissionCalendar) => {
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
        
        // Exact UTC date (YYYY-MM-DD)
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        
        const numCount = Number(count) || 0;
        dateMap[dateKey] = (dateMap[dateKey] || 0) + numCount;
        totalSubmissions += numCount;
    }

    const today = new Date();
    const numWeeks = 52;
    const totalDays = numWeeks * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (totalDays - 1));
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeks = [];
    let currentWeek = [];
    const monthLabels = [];
    let lastMonth = -1;

    for (let i = 0; i < numWeeks * 7; i++) {
        const curr = new Date(startDate);
        curr.setDate(startDate.getDate() + i);

        const yyyy = curr.getFullYear();
        const mm = String(curr.getMonth() + 1).padStart(2, '0');
        const dd = String(curr.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const count = dateMap[dateKey] || 0;

        let level = 0;
        if (count >= 8) level = 4;
        else if (count >= 5) level = 3;
        else if (count >= 3) level = 2;
        else if (count >= 1) level = 1;

        if (curr.getDay() === 0) {
            const m = curr.getMonth();
            if (m !== lastMonth) {
                const monthName = curr.toLocaleString('default', { month: 'short' });
                monthLabels.push({ index: Math.floor(i / 7), label: monthName });
                lastMonth = m;
            }
        }

        currentWeek.push({
            date: dateKey,
            displayDate: curr.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            count,
            level,
        });

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

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

    return {
        weeks,
        monthLabels,
        currentStreak: currentStreak || 72,
        maxStreak: maxStreak || 72,
        totalActiveDays: Object.keys(dateMap).length || 73,
        totalSubmissions: totalSubmissions || 278,
    };
};

// 🟩 LeetCode Square Contribution Heatmap Component (Just like GitHub)
const LeetCodeHeatmap = ({ calendarData, currentStreak, maxStreak, totalActiveDays, totalSubmissions }) => {
    const defaultData = useMemo(() => {
        return processLeetCodeCalendar(ARCHIVE_DATA.leetcode.submissionCalendar);
    }, []);

    const scrollRef = useRef(null);
    const data = calendarData || defaultData;
    const { weeks = [], monthLabels = [] } = data || {};
    const streak = currentStreak || data?.currentStreak || '72 Days';
    const longest = maxStreak || data?.maxStreak || '72 Days';
    const activeDays = totalActiveDays || data?.totalActiveDays || 73;
    const submissions = totalSubmissions || data?.totalSubmissions || 278;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [weeks]);

    const getColor = (level) => {
        switch (level) {
            case 1:
                return 'bg-emerald-300 hover:bg-emerald-400';
            case 2:
                return 'bg-emerald-400 hover:bg-emerald-500';
            case 3:
                return 'bg-emerald-600 hover:bg-emerald-700';
            case 4:
                return 'bg-emerald-800 hover:bg-emerald-900';
            default:
                return 'bg-gray-100 hover:bg-gray-200';
        }
    };

    return (
        <div className='bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 select-none'>
            {/* Header with Live Streak Badges */}
            <div className='flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5'>
                <div className='flex items-center gap-2'>
                    <div className='p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600'>
                        <Flame className='w-4 h-4' />
                    </div>
                    <div>
                        <h4 className='text-xs font-bold text-gray-800 flex items-center gap-1.5'>
                            <span>LeetCode Contribution Calendar</span>
                            <span className='inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200'>
                                <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                                Live Submissions
                            </span>
                        </h4>
                        <p className='text-[10px] text-gray-500'>
                            {submissions} submissions in past year • {activeDays} active days
                        </p>
                    </div>
                </div>

                {/* Badges */}
                <div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
                    <div className='flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shadow-xs'>
                        <Flame className='w-3 h-3 text-amber-500 fill-amber-500' />
                        <span>Streak: {streak}</span>
                    </div>
                    <div className='flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 shadow-xs'>
                        <Trophy className='w-3 h-3 text-teal-600' />
                        <span>Max: {longest}</span>
                    </div>
                </div>
            </div>

            {/* Heatmap Grid Section */}
            <div ref={scrollRef} className='relative w-full overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300'>
                <div className='w-max min-w-[750px] pr-2'>
                    {/* Month labels header */}
                    <div className='flex text-[10px] text-gray-400 pl-7 mb-1.5 font-mono h-4 relative'>
                        {monthLabels.map((m, idx) => (
                            <span
                                key={idx}
                                className='absolute text-[10px] text-gray-500 font-medium'
                                style={{ left: `${m.index * 14 + 28}px` }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>

                    {/* Day Labels + Week Columns Grid */}
                    <div className='flex gap-1.5 items-start'>
                        {/* Day of Week labels */}
                        <div className='flex flex-col gap-1 text-[9px] font-mono text-gray-400 pr-1 select-none flex-none pt-0.5'>
                            <span className='h-2.5 leading-[10px]'>Sun</span>
                            <span className='h-2.5 leading-[10px] text-transparent'>Mon</span>
                            <span className='h-2.5 leading-[10px]'>Tue</span>
                            <span className='h-2.5 leading-[10px] text-transparent'>Wed</span>
                            <span className='h-2.5 leading-[10px]'>Thu</span>
                            <span className='h-2.5 leading-[10px] text-transparent'>Fri</span>
                            <span className='h-2.5 leading-[10px]'>Sat</span>
                        </div>

                        {/* Week Columns of Squares */}
                        <div className='flex gap-1 flex-1'>
                            {weeks.map((week, wIndex) => (
                                <div key={wIndex} className='flex flex-col gap-1'>
                                    {week.map((day, dIndex) => (
                                        <div
                                            key={dIndex}
                                            title={`${day.count || 0} submission${day.count === 1 ? '' : 's'} on ${day.displayDate || day.date}`}
                                            className={`w-2.5 h-2.5 rounded-[2px] ${getColor(day.level)} hover:scale-125 transition-transform duration-100 cursor-pointer`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer with Scale Legend & Quick Stats */}
            <div className='flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100 flex-wrap gap-2'>
                <div className='flex items-center gap-2 text-[10px] text-gray-500 font-mono'>
                    <span>Current Streak: <strong className='text-amber-600 font-bold'>{streak}</strong></span>
                    <span>•</span>
                    <span>Active Days: <strong className='text-emerald-700 font-bold'>{activeDays}</strong></span>
                </div>
                <div className='flex items-center gap-1.5 text-[10px] text-gray-500'>
                    <span>Less</span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-gray-100 inline-block'></span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-emerald-200 inline-block'></span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block'></span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block'></span>
                    <span className='w-2.5 h-2.5 rounded-sm bg-emerald-800 inline-block'></span>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};

// LeetCode Progress Ring Component
const LeetCodeRing = ({ solved, total, breakdown }) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const safeTotal = total || 4046;
    const safeSolved = solved || 142;

    const easySolved = breakdown?.easy?.solved || 103;
    const medSolved = breakdown?.medium?.solved || 37;
    const hardSolved = breakdown?.hard?.solved || 2;

    const easyOffset = circumference - (easySolved / safeTotal) * circumference;
    const medOffset = circumference - (medSolved / safeTotal) * circumference;
    const hardOffset = circumference - (hardSolved / safeTotal) * circumference;

    return (
        <div className='relative flex items-center justify-center size-24 flex-none'>
            <svg className='size-full -rotate-90' viewBox='0 0 100 100'>
                <circle
                    cx='50'
                    cy='50'
                    r={radius}
                    className='text-gray-100'
                    strokeWidth='7'
                    stroke='currentColor'
                    fill='transparent'
                />
                <circle
                    cx='50'
                    cy='50'
                    r={radius}
                    stroke='#00B8A3'
                    strokeWidth='7'
                    strokeDasharray={circumference}
                    strokeDashoffset={easyOffset}
                    strokeLinecap='round'
                    fill='transparent'
                />
                <circle
                    cx='50'
                    cy='50'
                    r={radius}
                    stroke='#FFC01E'
                    strokeWidth='7'
                    strokeDasharray={circumference}
                    strokeDashoffset={medOffset}
                    strokeLinecap='round'
                    fill='transparent'
                />
                <circle
                    cx='50'
                    cy='50'
                    r={radius}
                    stroke='#FF375F'
                    strokeWidth='7'
                    strokeDasharray={circumference}
                    strokeDashoffset={hardOffset}
                    strokeLinecap='round'
                    fill='transparent'
                />
            </svg>
            <div className='absolute flex flex-col items-center justify-center text-center'>
                <span className='text-base font-bold text-gray-800 leading-none'>{safeSolved}</span>
                <span className='text-[9px] text-gray-400 mt-0.5'>Solved</span>
            </div>
        </div>
    );
};

const LANGUAGE_COLORS = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    React: '#61dafb',
    CSS: '#563d7c',
    HTML: '#e34c26',
    EJS: '#a91e50',
    Python: '#3572A5',
    'C++': '#f34b7d',
    C: '#555555',
    Java: '#b07219',
};

// Helpful descriptions for Asif's repositories
const REPO_DESCRIPTIONS = {
    EasyTalk: 'Real-time chatting and language-exchange MERN application with WebRTC & Socket.io.',
    'World-country-info': 'Responsive web app exploring detailed global country data with REST API integration.',
    wanderlust: 'Full-Stack MERN travel listing and booking platform by Mohd Asif.',
    'File-Explorer': 'Interactive tree-view file and folder explorer component built with React.',
    'Multiple---selector-search': 'Custom multi-select dropdown with instant search and filtering in React.',
    'OTP-input': 'Custom OTP (One-Time Password) digit verification input UI with auto-focus behavior.',
    'Accordion-react-prectice': 'Collapsible accordion UI component with smooth state animations in React.',
    ProgressBar: 'Custom animated progress bar component with percentage indicator and theme support.',
    'Tab-Form-in-react-': 'Multi-step tabbed form with live field validation and state management in React.',
    'codepastes.com': 'Code snippet sharing and pastebin web application for developers.',
    'Pagination-in-react-': 'Clean client-side and server-side pagination component with page controls.',
    'auto-complete-search-bar': 'Debounced auto-complete search bar with dynamic suggestion dropdown.',
    mohdasif03hy: 'GitHub profile configuration repository and portfolio bio showcase.',
    'react-practice-03hy': 'React frontend practice collection featuring modern reusable UI patterns.',
    project2: 'Full-stack web application experiment with modern frontend libraries.',
};

// Clean repository display name
const formatRepoName = (name) => {
    if (!name) return 'Repository';
    return name.replace(/---/g, ' - ').replace(/--/g, ' ');
};

const Archive = () => {
    const { windows } = useWindowStore();
    const trashData = windows['trash']?.data;
    const [activeTab, setActiveTab] = useState(trashData?.tab || 'overview');
    const [searchRepo, setSearchRepo] = useState('');

    useEffect(() => {
        if (trashData?.tab) {
            setActiveTab(trashData.tab);
        }
    }, [trashData?.tab]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Live States
    const [githubProfile, setGithubProfile] = useState(null);
    const [githubRepos, setGithubRepos] = useState([]);
    const [githubContributions, setGithubContributions] = useState([]);
    const [totalContributions, setTotalContributions] = useState(530);

    const [leetcodeStats, setLeetcodeStats] = useState(null);
    const [leetcodeSubmissions, setLeetcodeSubmissions] = useState([]);
    const [leetcodeCalendar, setLeetcodeCalendar] = useState(null);

    const githubUsername = 'mohdAsif03hy';
    const leetcodeUsername = 'rk12SuClSa';
    const githubProfileUrl = 'https://github.com/mohdAsif03hy?tab=repositories';
    const leetcodeProfileUrl = 'https://leetcode.com/u/rk12SuClSa/';

    // Fetch Live Data function with resilient multi-endpoint fallback
    const fetchLiveData = useCallback(async () => {
        setIsLoading(true);
        const timestamp = Date.now();
        try {
            // 1. Fetch GitHub User Profile (with cache buster)
            const ghUserPromise = fetch(`https://api.github.com/users/${githubUsername}?t=${timestamp}`, { cache: 'no-store' })
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null);

            // 2. Fetch GitHub Repos (with cache buster)
            const ghReposPromise = fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100&t=${timestamp}`, { cache: 'no-store' })
                .then((r) => (r.ok ? r.json() : []))
                .catch(() => []);

            // 3. Fetch GitHub Contributions (with cache buster)
            const ghContribPromise = fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last&t=${timestamp}`, { cache: 'no-store' })
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null);

            // 4. Fetch LeetCode Data & Calendar (Vercel edge API primary -> Render API fallback)
            const lcDataPromise = (async () => {
                try {
                    const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${leetcodeUsername}?t=${timestamp}`, { cache: 'no-store' });
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.totalSolved !== undefined) {
                            return data;
                        }
                    }
                } catch (e) {
                    console.log('Primary LeetCode API failed, falling back...', e);
                }

                // Fallback to Render API
                try {
                    const [profileRes, subRes, calRes] = await Promise.all([
                        fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${leetcodeUsername}?t=${timestamp}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
                        fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/acSubmission?limit=10&t=${timestamp}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
                        fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/calendar?t=${timestamp}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
                    ]);
                    if (profileRes) {
                        return {
                            ...profileRes,
                            recentSubmissions: subRes?.submission || profileRes.recentSubmissions || [],
                            submissionCalendar: calRes?.submissionCalendar || profileRes.submissionCalendar,
                            streak: calRes?.streak || profileRes.streak,
                            totalActiveDays: calRes?.totalActiveDays || profileRes.totalActiveDays,
                        };
                    }
                } catch (e) {
                    console.log('Fallback LeetCode API error', e);
                }
                return null;
            })();

            const [ghUser, ghRepos, ghContrib, lcData] = await Promise.all([
                ghUserPromise,
                ghReposPromise,
                ghContribPromise,
                lcDataPromise,
            ]);

            if (ghUser) setGithubProfile(ghUser);
            if (Array.isArray(ghRepos) && ghRepos.length > 0) setGithubRepos(ghRepos);
            if (ghContrib?.contributions) {
                setGithubContributions(ghContrib.contributions);
                if (ghContrib.total?.lastYear) setTotalContributions(ghContrib.total.lastYear);
            }

            if (lcData && lcData.totalSolved !== undefined) {
                setLeetcodeStats(lcData);
                if (Array.isArray(lcData.recentSubmissions) && lcData.recentSubmissions.length > 0) {
                    setLeetcodeSubmissions(lcData.recentSubmissions);
                }
                if (lcData.submissionCalendar) {
                    setLeetcodeCalendar(lcData.submissionCalendar);
                }
            }

            setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } catch (error) {
            console.error('Error fetching live stats:', error);
        } finally {
            setIsLoading(false);
        }
    }, [githubUsername, leetcodeUsername]);

    useEffect(() => {
        fetchLiveData();
    }, [fetchLiveData]);

    // Computed LeetCode Calendar and Live Streaks
    const processedLeetCodeCalendar = useMemo(() => {
        return processLeetCodeCalendar(leetcodeCalendar);
    }, [leetcodeCalendar]);

    // Computed Languages Breakdown from Live Repositories
    const languageBreakdown = useMemo(() => {
        if (!githubRepos.length) {
            return ARCHIVE_DATA.github.topLanguages;
        }

        const counts = {};
        let total = 0;
        githubRepos.forEach((repo) => {
            if (repo.language) {
                counts[repo.language] = (counts[repo.language] || 0) + 1;
                total++;
            }
        });

        if (total === 0) return ARCHIVE_DATA.github.topLanguages;

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, count]) => ({
                name,
                percent: Math.round((count / total) * 100),
                color: LANGUAGE_COLORS[name] || '#6366f1',
            }));
    }, [githubRepos]);

    // Total Live Stars
    const totalStars = useMemo(() => {
        return githubRepos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    }, [githubRepos]);

    // Format LeetCode Stats with live streaks
    const formattedLeetCode = useMemo(() => {
        const streakVal = processedLeetCodeCalendar?.currentStreak
            ? `${processedLeetCodeCalendar.currentStreak} Days`
            : ARCHIVE_DATA.leetcode.currentStreak || '72 Days';

        const maxStreakVal = processedLeetCodeCalendar?.maxStreak
            ? `${processedLeetCodeCalendar.maxStreak} Days`
            : ARCHIVE_DATA.leetcode.longestStreak || '72 Days';

        const totalActiveVal = processedLeetCodeCalendar?.totalActiveDays || ARCHIVE_DATA.leetcode.totalActiveDays || 73;
        const totalSubmissionsVal = processedLeetCodeCalendar?.totalSubmissions || ARCHIVE_DATA.leetcode.totalSubmissions || 278;

        if (leetcodeStats) {
            return {
                totalSolved: leetcodeStats.totalSolved,
                totalQuestions: leetcodeStats.totalQuestions || 4046,
                ranking: `#${leetcodeStats.ranking?.toLocaleString() || '1,237,819'}`,
                currentStreak: streakVal,
                longestStreak: maxStreakVal,
                totalActiveDays: totalActiveVal,
                totalSubmissions: totalSubmissionsVal,
                easy: {
                    solved: leetcodeStats.easySolved ?? ARCHIVE_DATA.leetcode.breakdown.easy?.solved ?? 140,
                    total: leetcodeStats.totalEasy || 963,
                    color: '#00B8A3',
                },
                medium: {
                    solved: leetcodeStats.mediumSolved ?? ARCHIVE_DATA.leetcode.breakdown.medium?.solved ?? 65,
                    total: leetcodeStats.totalMedium || 2111,
                    color: '#FFC01E',
                },
                hard: {
                    solved: leetcodeStats.hardSolved ?? ARCHIVE_DATA.leetcode.breakdown.hard?.solved ?? 2,
                    total: leetcodeStats.totalHard || 972,
                    color: '#FF375F',
                },
            };
        }
        return {
            totalSolved: ARCHIVE_DATA.leetcode.totalSolved || 207,
            totalQuestions: 4046,
            ranking: ARCHIVE_DATA.leetcode.ranking || '#834,608',
            currentStreak: streakVal,
            longestStreak: maxStreakVal,
            totalActiveDays: totalActiveVal,
            totalSubmissions: totalSubmissionsVal,
            easy: { solved: ARCHIVE_DATA.leetcode.breakdown.easy?.solved || 140, total: 963, color: '#00B8A3' },
            medium: { solved: ARCHIVE_DATA.leetcode.breakdown.medium?.solved || 65, total: 2111, color: '#FFC01E' },
            hard: { solved: ARCHIVE_DATA.leetcode.breakdown.hard?.solved || 2, total: 972, color: '#FF375F' },
        };
    }, [leetcodeStats, processedLeetCodeCalendar]);

    // Filter Repositories
    const filteredRepos = useMemo(() => {
        const list = githubRepos.length > 0 ? githubRepos : ARCHIVE_DATA.github.pinnedRepos;
        if (!searchRepo.trim()) return list;
        return list.filter((r) =>
            r.name.toLowerCase().includes(searchRepo.toLowerCase()) ||
            (r.description || '').toLowerCase().includes(searchRepo.toLowerCase()) ||
            (r.language || '').toLowerCase().includes(searchRepo.toLowerCase())
        );
    }, [githubRepos, searchRepo]);

    const navTabs = [
        { id: 'overview', title: 'Live Overview', icon: Activity },
        { id: 'github', title: 'GitHub Live', icon: GitCommit },
        { id: 'leetcode', title: 'LeetCode Live', icon: Code2 },
        { id: 'archived', title: 'All Repositories', icon: FolderArchive },
    ];

    return (
        <div className='flex flex-col h-full w-full bg-white select-none overflow-hidden'>
            <div id='window-header' className='flex-none flex items-center justify-between px-3 py-2 border-b border-gray-200/80 bg-gray-50/90 backdrop-blur-md'>
                <WindowControlls target='trash' />
                <div className='flex items-center gap-1.5'>
                    <FolderArchive className='w-4 h-4 text-emerald-600' />
                    <h2 className='text-xs font-semibold text-gray-700 truncate'>
                        Live Activity & Stats
                    </h2>
                </div>
                <div className='flex items-center gap-1.5 sm:gap-3'>
                    <button
                        type='button'
                        onClick={fetchLiveData}
                        disabled={isLoading}
                        title='Sync live data from GitHub & LeetCode APIs'
                        className='flex items-center gap-1 text-[11px] sm:text-xs text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 px-2 py-0.5 rounded-lg border border-gray-200 transition-colors'
                    >
                        <RefreshCw className={clsx('w-3 h-3', isLoading && 'animate-spin text-emerald-600')} />
                        <span className='hidden sm:inline'>{isLoading ? 'Syncing...' : 'Live Sync'}</span>
                    </button>
                    <div className='flex items-center gap-1 text-[10px] sm:text-xs text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></span>
                        <span className='hidden sm:inline'>{lastUpdated ? `Live (${lastUpdated})` : 'Connected'}</span>
                        <span className='sm:hidden'>Live</span>
                    </div>
                </div>
            </div>

            {/* 📱 Mobile Top Horizontal Tab Bar */}
            <div className='sm:hidden flex items-center gap-1 px-2.5 py-1.5 bg-gray-100/90 border-b border-gray-200 overflow-x-auto scrollbar-none flex-none touch-pan-x'>
                {navTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            type='button'
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150',
                                tab.id === activeTab
                                    ? 'bg-emerald-600 text-white shadow-sm scale-105'
                                    : 'bg-white/80 text-gray-700 hover:bg-gray-200'
                            )}
                        >
                            <TabIcon className='w-3 h-3' />
                            <span>{tab.title}</span>
                        </button>
                    );
                })}
            </div>

            <div className='flex flex-col sm:flex-row w-full flex-1 overflow-hidden h-full min-h-0'>
                {/* 💻 Desktop Sidebar */}
                <div className='hidden sm:flex flex-col w-48 bg-gray-50/80 border-r border-gray-200 p-3 h-full flex-none overflow-y-auto'>
                    <h2 className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2'>
                        Live Stats & Archive
                    </h2>
                    <ul className='space-y-1'>
                        {navTabs.map((tab) => {
                            const TabIcon = tab.icon;
                            return (
                                <li
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors text-xs font-medium',
                                        tab.id === activeTab
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-200/70'
                                    )}
                                >
                                    <TabIcon className='w-3.5 h-3.5' />
                                    <span>{tab.title}</span>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Quick Live Profile Links */}
                    <div className='mt-auto pt-3 border-t border-gray-200 space-y-1.5'>
                        <a
                            href={githubProfileUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='flex items-center justify-between text-xs text-gray-600 hover:text-black p-1.5 rounded hover:bg-gray-100 transition-colors'
                        >
                            <span className='flex items-center gap-1.5 font-medium'>
                                <GitBranch className='w-3.5 h-3.5' /> GitHub Repos
                            </span>
                            <ExternalLink className='w-3 h-3 text-gray-400' />
                        </a>
                        <a
                            href={leetcodeProfileUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='flex items-center justify-between text-xs text-gray-600 hover:text-amber-600 p-1.5 rounded hover:bg-gray-100 transition-colors'
                        >
                            <span className='flex items-center gap-1.5 font-medium'>
                                <Trophy className='w-3.5 h-3.5' /> LeetCode Profile
                            </span>
                            <ExternalLink className='w-3 h-3 text-gray-400' />
                        </a>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className='content-area flex-1 bg-gray-50/60 p-2.5 sm:p-4 pb-8 overflow-y-auto min-h-0'>
                    {/* 1. OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className='space-y-3'>
                            {/* Summary Metrics */}
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5'>
                                <div className='bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-sm'>
                                    <div className='flex items-center justify-between text-emerald-600 mb-1'>
                                        <GitCommit className='w-3.5 h-3.5' />
                                        <span className='text-[9px] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-700'>
                                            Live GitHub
                                        </span>
                                    </div>
                                    <p className='text-sm sm:text-base font-bold text-gray-800'>{totalContributions}+</p>
                                    <p className='text-[10px] text-gray-500'>Yearly Commits</p>
                                </div>


                                <div className='bg-white p-3 rounded-xl border border-gray-200 shadow-sm'>
                                    <div className='flex items-center justify-between text-amber-500 mb-1'>
                                        <Flame className='w-3.5 h-3.5' />
                                        <span className='text-[9px] font-semibold bg-amber-50 px-1.5 py-0.5 rounded text-amber-700'>
                                            Live Streak
                                        </span>
                                    </div>
                                    <p className='text-base font-bold text-gray-800'>{formattedLeetCode.currentStreak}</p>
                                    <p className='text-[10px] text-gray-500'>Active Daily Streak</p>
                                </div>

                                <div className='bg-white p-3 rounded-xl border border-gray-200 shadow-sm'>
                                    <div className='flex items-center justify-between text-blue-600 mb-1'>
                                        <Code2 className='w-3.5 h-3.5' />
                                        <span className='text-[9px] font-semibold bg-blue-50 px-1.5 py-0.5 rounded text-blue-700'>
                                            LeetCode
                                        </span>
                                    </div>
                                    <p className='text-base font-bold text-gray-800'>{formattedLeetCode.totalSolved}</p>
                                    <p className='text-[10px] text-gray-500'>Problems Solved</p>
                                </div>

                                <div className='bg-white p-3 rounded-xl border border-gray-200 shadow-sm'>
                                    <div className='flex items-center justify-between text-purple-600 mb-1'>
                                        <Trophy className='w-3.5 h-3.5' />
                                        <span className='text-[9px] font-semibold bg-purple-50 px-1.5 py-0.5 rounded text-purple-700'>
                                            Global Rank
                                        </span>
                                    </div>
                                    <p className='text-sm font-bold text-gray-800 truncate'>{formattedLeetCode.ranking}</p>
                                    <p className='text-[10px] text-gray-500'>LeetCode Rank</p>
                                </div>
                            </div>

                            {/* 📈 Live GitHub Activity Trend Velocity Chart */}
                            <GitHubActivityChart liveContributions={githubContributions} />

                            {/* 🏆 LeetCode Contest Rating Chart */}
                            <LeetCodeRatingChart />

                            {/* GitHub Heatmap */}
                            <GitHubHeatmap
                                liveContributions={githubContributions}
                                totalContributions={totalContributions}
                            />

                            {/* LeetCode Heatmap */}
                            <LeetCodeHeatmap
                                calendarData={processedLeetCodeCalendar}
                                currentStreak={formattedLeetCode.currentStreak}
                                maxStreak={formattedLeetCode.longestStreak}
                                totalActiveDays={formattedLeetCode.totalActiveDays}
                                totalSubmissions={formattedLeetCode.totalSubmissions}
                            />

                            {/* Dual Highlights */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pb-2'>
                                <div className='bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-2 flex flex-col justify-between'>
                                    <div>
                                        <div className='flex items-center justify-between mb-1.5'>
                                            <h4 className='text-xs font-semibold text-gray-800 flex items-center gap-1.5'>
                                                <Sparkles className='w-3.5 h-3.5 text-amber-500' /> Featured Live Project
                                            </h4>
                                            <a
                                                href={githubProfileUrl}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='text-[11px] text-blue-600 hover:underline flex items-center gap-1'
                                            >
                                                All Repos <ExternalLink className='w-3 h-3' />
                                            </a>
                                        </div>
                                        <p className='text-xs font-bold text-gray-800 mb-1'>
                                            {githubRepos[0]?.name || 'EasyTalk'}
                                        </p>
                                        <p className='text-[11px] text-gray-600 line-clamp-2'>
                                            {REPO_DESCRIPTIONS[githubRepos[0]?.name] ||
                                                githubRepos[0]?.description ||
                                                'Real-time communication and chat application built with MERN stack.'}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-3 pt-2 border-t border-gray-100 text-[10px] text-gray-500'>
                                        <span className='flex items-center gap-1 font-medium'>
                                            <span
                                                className='w-2 h-2 rounded-full'
                                                style={{
                                                    backgroundColor:
                                                        LANGUAGE_COLORS[githubRepos[0]?.language] || '#f7df1e',
                                                }}
                                            />
                                            {githubRepos[0]?.language || 'JavaScript'}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <Star className='w-3 h-3 text-amber-400' />{' '}
                                             {githubRepos[0]?.stargazers_count || 1}
                                        </span>
                                    </div>
                                </div>

                                <div className='bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-2 flex flex-col justify-between'>
                                    <div>
                                        <div className='flex items-center justify-between mb-1.5'>
                                            <h4 className='text-xs font-semibold text-gray-800 flex items-center gap-1.5'>
                                                <Award className='w-3.5 h-3.5 text-blue-500' /> Live LeetCode Progress
                                            </h4>
                                            <a
                                                href={leetcodeProfileUrl}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='text-[11px] text-blue-600 hover:underline flex items-center gap-1'
                                            >
                                                Profile <ExternalLink className='w-3 h-3' />
                                            </a>
                                        </div>
                                        <div className='space-y-1'>
                                            <div className='flex justify-between items-center text-[10px] bg-teal-50 px-2 py-0.5 rounded text-teal-800 font-medium'>
                                                <span>Easy Solved</span>
                                                <span className='font-bold'>{formattedLeetCode.easy.solved}</span>
                                            </div>
                                            <div className='flex justify-between items-center text-[10px] bg-amber-50 px-2 py-0.5 rounded text-amber-800 font-medium'>
                                                <span>Medium Solved</span>
                                                <span className='font-bold'>{formattedLeetCode.medium.solved}</span>
                                            </div>
                                            <div className='flex justify-between items-center text-[10px] bg-rose-50 px-2 py-0.5 rounded text-rose-800 font-medium'>
                                                <span>Hard Solved</span>
                                                <span className='font-bold'>{formattedLeetCode.hard.solved}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. GITHUB ACTIVITY TAB */}
                    {activeTab === 'github' && (
                        <div className='space-y-3.5 pb-2'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-gray-200 shadow-sm'>
                                <div className='flex items-center gap-2.5'>
                                    <div className='p-2 rounded-xl bg-gray-900 text-white'>
                                        <GitBranch className='w-5 h-5' />
                                    </div>
                                    <div>
                                        <h3 className='text-xs font-bold text-gray-800'>@{githubUsername}</h3>
                                        <p className='text-[11px] text-gray-500'>
                                            {githubProfile?.public_repos || githubRepos.length || 15} Public Repositories • {totalStars} Total Stars
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={githubProfileUrl}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='w-full sm:w-auto text-center justify-center px-2.5 py-1 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow transition-colors'
                                >
                                    Open GitHub Repos <ExternalLink className='w-3 h-3' />
                                </a>
                            </div>

                            {/* 📈 GitHub Activity Velocity Trend Chart */}
                            <GitHubActivityChart liveContributions={githubContributions} />

                            {/* Live Heatmap */}
                            <GitHubHeatmap
                                liveContributions={githubContributions}
                                totalContributions={totalContributions}
                            />

                            {/* Language Breakdown */}
                            <div className='bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-2.5'>
                                <h4 className='text-xs font-semibold text-gray-800'>Live Language Breakdown</h4>
                                <div className='flex h-2.5 rounded-full overflow-hidden gap-0.5 bg-gray-100'>
                                    {languageBreakdown.map((lang, idx) => (
                                        <div
                                            key={idx}
                                            style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                                            title={`${lang.name}: ${lang.percent}%`}
                                        />
                                    ))}
                                </div>
                                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5'>
                                    {languageBreakdown.map((lang, idx) => (
                                        <div key={idx} className='flex items-center gap-1.5 text-[11px] text-gray-600'>
                                            <span
                                                className='w-2 h-2 rounded-full flex-none'
                                                style={{ backgroundColor: lang.color }}
                                            />
                                            <span className='font-medium truncate'>{lang.name}</span>
                                            <span className='text-gray-400 font-mono'>{lang.percent}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Live Repositories */}
                            <div className='space-y-2'>
                                <h4 className='text-xs font-semibold text-gray-700 px-1'>Recent Active Repositories</h4>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5'>
                                    {(githubRepos.slice(0, 6).length > 0 ? githubRepos.slice(0, 6) : ARCHIVE_DATA.github.pinnedRepos).map(
                                        (repo, idx) => (
                                            <div
                                                key={idx}
                                                className='bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[115px] hover:border-gray-300 transition-colors'
                                            >
                                                <div>
                                                    <div className='flex items-center justify-between mb-1'>
                                                        <p className='text-xs font-bold text-blue-600 truncate' title={repo.name}>
                                                            {formatRepoName(repo.name)}
                                                        </p>
                                                        <a
                                                            href={repo.html_url || repo.url}
                                                            target='_blank'
                                                            rel='noreferrer'
                                                        >
                                                            <ExternalLink className='w-3 h-3 text-gray-400 hover:text-gray-600' />
                                                        </a>
                                                    </div>
                                                    <p className='text-[10px] text-gray-600 line-clamp-2 mb-2'>
                                                        {REPO_DESCRIPTIONS[repo.name] || repo.description || 'Public repository by Mohd Asif'}
                                                    </p>
                                                </div>
                                                <div className='flex items-center justify-between text-[10px] text-gray-500 pt-1.5 border-t border-gray-100'>
                                                    <span className='flex items-center gap-1'>
                                                        <span
                                                            className='w-2 h-2 rounded-full'
                                                            style={{
                                                                backgroundColor:
                                                                    LANGUAGE_COLORS[repo.language] || '#6366f1',
                                                             }}
                                                        />
                                                        {repo.language || 'Code'}
                                                    </span>
                                                    <span className='flex items-center gap-1'>
                                                        <Star className='w-3 h-3 text-amber-400' /> {repo.stargazers_count || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. LEETCODE STATS TAB */}
                    {activeTab === 'leetcode' && (
                        <div className='space-y-3.5 pb-2'>
                            {/* LeetCode Header Banner */}
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-gray-200 shadow-sm'>
                                <div className='flex items-center gap-2.5'>
                                    <div className='p-2 rounded-xl bg-amber-500 text-white'>
                                        <Code2 className='w-5 h-5' />
                                    </div>
                                    <div>
                                        <h3 className='text-xs font-bold text-gray-800'>@{leetcodeUsername}</h3>
                                        <p className='text-[11px] text-gray-500'>
                                            Total Solved: {formattedLeetCode.totalSolved} • Rank: {formattedLeetCode.ranking}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={leetcodeProfileUrl}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='w-full sm:w-auto text-center justify-center px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow transition-colors'
                                >
                                    LeetCode Profile <ExternalLink className='w-3 h-3' />
                                </a>
                            </div>

                            {/* 4 Live LeetCode Metric Cards */}
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5'>
                                <div className='bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-sm'>
                                    <div className='flex items-center justify-between text-amber-500 mb-1'>
                                        <Flame className='w-3.5 h-3.5 text-amber-500 fill-amber-500' />
                                        <span className='text-[9px] font-semibold bg-amber-50 px-1.5 py-0.5 rounded text-amber-700'>
                                            Active
                                        </span>
                                    </div>
                                    <p className='text-sm sm:text-base font-bold text-gray-800'>{formattedLeetCode.currentStreak}</p>
                                    <p className='text-[10px] text-gray-500'>Current Streak</p>
                                </div>

                                <div className='bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-sm'>
                                    <div className='flex items-center justify-between text-teal-600 mb-1'>
                                        <Trophy className='w-3.5 h-3.5' />
                                        <span className='text-[9px] font-semibold bg-teal-50 px-1.5 py-0.5 rounded text-teal-700'>
                                            Record
                                        </span>
                                    </div>
                                    <p className='text-sm sm:text-base font-bold text-gray-800'>{formattedLeetCode.longestStreak}</p>
                                    <p className='text-[10px] text-gray-500'>Max Streak</p>
                                </div>

                                <div className='bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-sm'>
                                    <div className='flex items-center justify-between text-blue-600 mb-1'>
                                        <Calendar className='w-3.5 h-3.5' />
                                        <span className='text-[9px] font-semibold bg-blue-50 px-1.5 py-0.5 rounded text-blue-700'>
                                            Active
                                        </span>
                                    </div>
                                    <p className='text-sm sm:text-base font-bold text-gray-800'>{formattedLeetCode.totalActiveDays} Days</p>
                                    <p className='text-[10px] text-gray-500'>Active Days</p>
                                </div>

                                <div className='bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-sm'>
                                    <div className='flex items-center justify-between text-purple-600 mb-1'>
                                        <Code2 className='w-3.5 h-3.5' />
                                        <span className='text-[9px] font-semibold bg-purple-50 px-1.5 py-0.5 rounded text-purple-700'>
                                            Total
                                        </span>
                                    </div>
                                    <p className='text-sm sm:text-base font-bold text-gray-800'>{formattedLeetCode.totalSubmissions}</p>
                                    <p className='text-[10px] text-gray-500'>Yearly Submissions</p>
                                </div>
                            </div>

                            {/* 🟩 Live LeetCode Square Contribution Heatmap (Just like GitHub) */}
                            <LeetCodeHeatmap
                                calendarData={processedLeetCodeCalendar}
                                currentStreak={formattedLeetCode.currentStreak}
                                maxStreak={formattedLeetCode.longestStreak}
                                totalActiveDays={formattedLeetCode.totalActiveDays}
                                totalSubmissions={formattedLeetCode.totalSubmissions}
                            />

                            {/* 🏆 LeetCode Contest Rating Chart */}
                            <LeetCodeRatingChart />

                            {/* Solved Problems Breakdown & Ring */}
                            <div className='bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5'>
                                <LeetCodeRing
                                    solved={formattedLeetCode.totalSolved}
                                    total={formattedLeetCode.totalQuestions}
                                    breakdown={formattedLeetCode}
                                />

                                <div className='w-full sm:flex-1 space-y-2'>
                                    {/* Easy */}
                                    <div className='space-y-0.5'>
                                        <div className='flex justify-between text-[11px]'>
                                            <span className='font-semibold text-teal-600'>Easy</span>
                                            <span className='text-gray-500 font-mono'>
                                                {formattedLeetCode.easy.solved} / {formattedLeetCode.easy.total}
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-100 h-1.5 rounded-full overflow-hidden'>
                                            <div
                                                className='bg-[#00B8A3] h-full rounded-full transition-all duration-500'
                                                style={{
                                                    width: `${(formattedLeetCode.easy.solved / formattedLeetCode.easy.total) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Medium */}
                                    <div className='space-y-0.5'>
                                        <div className='flex justify-between text-[11px]'>
                                            <span className='font-semibold text-amber-500'>Medium</span>
                                            <span className='text-gray-500 font-mono'>
                                                {formattedLeetCode.medium.solved} / {formattedLeetCode.medium.total}
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-100 h-1.5 rounded-full overflow-hidden'>
                                            <div
                                                className='bg-[#FFC01E] h-full rounded-full transition-all duration-500'
                                                style={{
                                                    width: `${(formattedLeetCode.medium.solved / formattedLeetCode.medium.total) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Hard */}
                                    <div className='space-y-0.5'>
                                        <div className='flex justify-between text-[11px]'>
                                            <span className='font-semibold text-rose-500'>Hard</span>
                                            <span className='text-gray-500 font-mono'>
                                                {formattedLeetCode.hard.solved} / {formattedLeetCode.hard.total}
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-100 h-1.5 rounded-full overflow-hidden'>
                                            <div
                                                className='bg-[#FF375F] h-full rounded-full transition-all duration-500'
                                                style={{
                                                    width: `${(formattedLeetCode.hard.solved / formattedLeetCode.hard.total) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Solved Submissions List (Live from API) */}
                            <div className='bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-2'>
                                <h4 className='text-xs font-semibold text-gray-800 flex items-center justify-between'>
                                    <span>Recent Accepted Submissions (Live)</span>
                                    <span className='text-[10px] text-gray-400 font-normal'>Synced from LeetCode</span>
                                </h4>
                                <div className='divide-y divide-gray-100'>
                                    {(leetcodeSubmissions.length > 0
                                        ? leetcodeSubmissions.slice(0, 5)
                                        : ARCHIVE_DATA.leetcode.recentSubmissions
                                    ).map((sub, idx) => (
                                        <div key={idx} className='py-1.5 flex items-center justify-between text-xs'>
                                            <a
                                                href={
                                                    sub.titleSlug
                                                        ? `https://leetcode.com/problems/${sub.titleSlug}/`
                                                        : leetcodeProfileUrl
                                                }
                                                target='_blank'
                                                rel='noreferrer'
                                                className='text-gray-800 font-medium hover:text-blue-600 truncate flex items-center gap-1.5 text-[11px]'
                                            >
                                                <CheckCircle2 className='w-3.5 h-3.5 text-teal-600 flex-none' />
                                                <span className='truncate'>{sub.title}</span>
                                            </a>
                                            <div className='flex items-center gap-2.5 flex-none'>
                                                <span className='text-[9px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-mono'>
                                                    {sub.lang || 'cpp'}
                                                </span>
                                                <span className='text-[10px] text-gray-400'>
                                                    {sub.timestamp
                                                        ? new Date(parseInt(sub.timestamp) * 1000).toLocaleDateString()
                                                        : sub.time || 'Recently'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}


                    {/* 4. ALL REPOSITORIES TAB */}
                    {activeTab === 'archived' && (
                        <div className='space-y-3 pb-2'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pb-1 gap-2.5'>
                                <div>
                                    <h3 className='text-xs font-bold text-gray-800'>
                                        Live Public Repositories ({filteredRepos.length})
                                    </h3>
                                    <p className='text-[11px] text-gray-500'>
                                        Real-time repositories from @{githubUsername} on GitHub.
                                    </p>
                                </div>
                                <div className='flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm w-full sm:w-auto'>
                                    <Search className='w-3.5 h-3.5 text-gray-400' />
                                    <input
                                        type='text'
                                        placeholder='Filter repos...'
                                        value={searchRepo}
                                        onChange={(e) => setSearchRepo(e.target.value)}
                                        className='text-xs bg-transparent outline-none w-full sm:w-28 text-gray-700 placeholder:text-gray-400'
                                    />
                                </div>
                            </div>


                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                                {filteredRepos.map((proj, idx) => (
                                    <div
                                        key={proj.id || idx}
                                        className='bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[110px] hover:border-gray-300 transition-colors'
                                    >
                                        <div>
                                            <div className='flex items-center justify-between mb-1'>
                                                <h4 className='text-xs font-bold text-gray-800 truncate' title={proj.name}>
                                                    {formatRepoName(proj.name)}
                                                </h4>
                                                <span className='text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono'>
                                                    {proj.language || 'Code'}
                                                </span>
                                            </div>
                                            <p className='text-[10px] text-gray-600 line-clamp-2 mb-2'>
                                                {REPO_DESCRIPTIONS[proj.name] || proj.description || 'GitHub repository by Mohd Asif'}
                                            </p>
                                        </div>
                                        <div>
                                            <div className='flex items-center justify-between pt-1.5 border-t border-gray-100 text-[10px]'>
                                                <span className='text-gray-400 font-medium flex items-center gap-1'>
                                                    <Star className='w-3 h-3 text-amber-400' /> {proj.stargazers_count || 0}
                                                </span>
                                                <a
                                                    href={proj.html_url || proj.url || githubProfileUrl}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='text-blue-600 hover:underline flex items-center gap-1 font-medium'
                                                >
                                                    View Repo <ExternalLink className='w-3 h-3' />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};



const ArchiveWindow = WindowWrapper(Archive, 'trash');

export default ArchiveWindow;
