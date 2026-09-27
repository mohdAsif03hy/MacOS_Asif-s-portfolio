import React, { useState, useRef, useEffect } from 'react';
import useThemeStore from '#store/theme';
import {
    Sun,
    Moon,
    Wifi,
    Bluetooth,
    Airplay,
    Volume2,
    Sliders,
    Sparkles,
    Music,
    Play,
    Pause,
    Check,
    Radio,
} from 'lucide-react';
import clsx from 'clsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ControlCenter = () => {
    const { theme, setTheme, isControlCenterOpen, closeControlCenter } = useThemeStore();
    const panelRef = useRef(null);

    // Interactive states for Control Center modules
    const [wifiEnabled, setWifiEnabled] = useState(true);
    const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
    const [airdropEnabled, setAirdropEnabled] = useState(true);
    const [focusMode, setFocusMode] = useState(false);
    const [brightness, setBrightness] = useState(90);
    const [volume, setVolume] = useState(75);
    const [isPlaying, setIsPlaying] = useState(false);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!isControlCenterOpen) return;
            const target = e.target;
            if (
                panelRef.current &&
                !panelRef.current.contains(target) &&
                !target.closest('#control-center-trigger')
            ) {
                closeControlCenter();
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [isControlCenterOpen, closeControlCenter]);

    // GSAP Dropdown Entrance Animation
    useGSAP(() => {
        const el = panelRef.current;
        if (!el) return;

        if (isControlCenterOpen) {
            gsap.fromTo(
                el,
                { opacity: 0, y: -16, scale: 0.94 },
                { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out' }
            );
        }
    }, [isControlCenterOpen]);

    if (!isControlCenterOpen) return null;

    return (
        <aside
            id='macos-control-center'
            ref={panelRef}
            className={clsx(
                'fixed top-11 right-4 sm:right-6 z-50 w-[310px] sm:w-[330px] select-none',
                'rounded-3xl p-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.4)_inset]',
                'backdrop-blur-3xl transition-colors duration-300',
                theme === 'dark'
                    ? 'bg-neutral-900/85 text-white border border-white/15'
                    : 'bg-white/85 text-gray-900 border border-white/80'
            )}
        >
            {/* Header Title */}
            <div className='flex items-center justify-between px-1 mb-2.5'>
                <span className='text-[11px] font-bold tracking-tight opacity-70 uppercase font-mono'>
                    Control Center
                </span>
                <span className='text-[10px] font-semibold opacity-60'>macOS Sequoia</span>
            </div>

            {/* Top Grid: Connectivity & Focus */}
            <div className='grid grid-cols-2 gap-2 mb-2.5'>
                {/* 1. Connectivity Box */}
                <div
                    className={clsx(
                        'rounded-2xl p-2.5 flex flex-col justify-between border transition-colors duration-200',
                        theme === 'dark'
                            ? 'bg-white/5 border-white/10'
                            : 'bg-black/5 border-black/5'
                    )}
                >
                    {/* Wi-Fi */}
                    <div
                        onClick={() => setWifiEnabled(!wifiEnabled)}
                        className='flex items-center gap-2 cursor-pointer py-1 px-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
                    >
                        <div
                            className={clsx(
                                'w-7 h-7 rounded-full flex items-center justify-center transition-colors',
                                wifiEnabled
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-gray-300 dark:bg-neutral-700 text-gray-500 dark:text-gray-400'
                            )}
                        >
                            <Wifi className='w-3.5 h-3.5' />
                        </div>
                        <div className='min-w-0 flex-1 leading-tight'>
                            <span className='text-xs font-bold block truncate'>Wi-Fi</span>
                            <span className='text-[9.5px] opacity-65 block truncate'>
                                {wifiEnabled ? 'Home_5G' : 'Off'}
                            </span>
                        </div>
                    </div>

                    {/* Bluetooth */}
                    <div
                        onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                        className='flex items-center gap-2 cursor-pointer py-1 px-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
                    >
                        <div
                            className={clsx(
                                'w-7 h-7 rounded-full flex items-center justify-center transition-colors',
                                bluetoothEnabled
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-gray-300 dark:bg-neutral-700 text-gray-500 dark:text-gray-400'
                            )}
                        >
                            <Bluetooth className='w-3.5 h-3.5' />
                        </div>
                        <div className='min-w-0 flex-1 leading-tight'>
                            <span className='text-xs font-bold block truncate'>Bluetooth</span>
                            <span className='text-[9.5px] opacity-65 block truncate'>
                                {bluetoothEnabled ? 'AirPods Pro' : 'Off'}
                            </span>
                        </div>
                    </div>

                    {/* AirDrop */}
                    <div
                        onClick={() => setAirdropEnabled(!airdropEnabled)}
                        className='flex items-center gap-2 cursor-pointer py-1 px-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
                    >
                        <div
                            className={clsx(
                                'w-7 h-7 rounded-full flex items-center justify-center transition-colors',
                                airdropEnabled
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-gray-300 dark:bg-neutral-700 text-gray-500 dark:text-gray-400'
                            )}
                        >
                            <Radio className='w-3.5 h-3.5' />
                        </div>
                        <div className='min-w-0 flex-1 leading-tight'>
                            <span className='text-xs font-bold block truncate'>AirDrop</span>
                            <span className='text-[9.5px] opacity-65 block truncate'>
                                {airdropEnabled ? 'Contacts Only' : 'Off'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Focus & Shortcuts Column */}
                <div className='flex flex-col gap-2'>
                    {/* Focus Mode Card */}
                    <div
                        onClick={() => setFocusMode(!focusMode)}
                        className={clsx(
                            'flex-1 rounded-2xl p-2.5 flex items-center gap-2.5 cursor-pointer border transition-all duration-200',
                            focusMode
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                                : theme === 'dark'
                                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                : 'bg-black/5 border-black/5 hover:bg-black/10'
                        )}
                    >
                        <div
                            className={clsx(
                                'w-7 h-7 rounded-full flex items-center justify-center',
                                focusMode ? 'bg-white/25 text-white' : 'bg-indigo-500 text-white'
                            )}
                        >
                            <Moon className='w-3.5 h-3.5' />
                        </div>
                        <div className='leading-tight'>
                            <span className='text-xs font-bold block'>Focus</span>
                            <span className='text-[9.5px] opacity-75'>
                                {focusMode ? 'Do Not Disturb' : 'Off'}
                            </span>
                        </div>
                    </div>

                    {/* Stage Manager / AirPlay Pill */}
                    <div
                        className={clsx(
                            'rounded-2xl p-2.5 flex items-center gap-2.5 cursor-pointer border transition-colors',
                            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'
                        )}
                    >
                        <div className='w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center'>
                            <Airplay className='w-3.5 h-3.5' />
                        </div>
                        <div className='leading-tight'>
                            <span className='text-xs font-bold block'>AirPlay</span>
                            <span className='text-[9.5px] opacity-65'>MacBook Display</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ☀️ / 🌙 DAY & NIGHT MODE SWITCH (Apple Native Segmented Switch) */}
            <div
                className={clsx(
                    'rounded-2xl p-2 mb-2.5 border transition-colors',
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'
                )}
            >
                <div className='flex items-center justify-between mb-1.5 px-1'>
                    <span className='text-[10.5px] font-bold uppercase tracking-wide opacity-75'>
                        Appearance Mode
                    </span>
                    <span className='text-[9.5px] font-bold text-amber-500 flex items-center gap-1'>
                        <Sparkles className='w-2.5 h-2.5' />
                        Live Wallpaper
                    </span>
                </div>

                <div className='grid grid-cols-2 gap-1.5 bg-black/10 dark:bg-black/30 p-1 rounded-xl'>
                    {/* Day / Light Button */}
                    <button
                        type='button'
                        onClick={() => setTheme('light')}
                        className={clsx(
                            'flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer',
                            theme === 'light'
                                ? 'bg-white text-gray-900 shadow-md scale-[1.02]'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        )}
                    >
                        <Sun className='w-4 h-4 text-amber-500 fill-amber-400' />
                        <span>Day Mode</span>
                        {theme === 'light' && <Check className='w-3 h-3 text-blue-600 ml-0.5 stroke-[3]' />}
                    </button>

                    {/* Night / Dark Button */}
                    <button
                        type='button'
                        onClick={() => setTheme('dark')}
                        className={clsx(
                            'flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer',
                            theme === 'dark'
                                ? 'bg-neutral-800 text-white shadow-md scale-[1.02] border border-white/10'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        )}
                    >
                        <Moon className='w-4 h-4 text-indigo-400 fill-indigo-400' />
                        <span>Night Mode</span>
                        {theme === 'dark' && <Check className='w-3 h-3 text-blue-400 ml-0.5 stroke-[3]' />}
                    </button>
                </div>
            </div>

            {/* Display Brightness Slider */}
            <div
                className={clsx(
                    'rounded-2xl p-2.5 mb-2 border transition-colors',
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'
                )}
            >
                <div className='flex items-center justify-between text-[10px] font-bold opacity-75 mb-1 px-0.5'>
                    <span>Display</span>
                    <span>{brightness}%</span>
                </div>
                <div className='relative h-7 rounded-xl bg-black/10 dark:bg-black/30 overflow-hidden flex items-center px-2'>
                    <div
                        className='absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl transition-all duration-100 opacity-90'
                        style={{ width: `${brightness}%` }}
                    />
                    <Sun className='w-4 h-4 relative z-10 text-white drop-shadow-sm pointer-events-none' />
                    <input
                        type='range'
                        min='20'
                        max='100'
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20'
                    />
                </div>
            </div>

            {/* Sound / Volume Slider */}
            <div
                className={clsx(
                    'rounded-2xl p-2.5 mb-2.5 border transition-colors',
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'
                )}
            >
                <div className='flex items-center justify-between text-[10px] font-bold opacity-75 mb-1 px-0.5'>
                    <span>Sound</span>
                    <span>{volume}%</span>
                </div>
                <div className='relative h-7 rounded-xl bg-black/10 dark:bg-black/30 overflow-hidden flex items-center px-2'>
                    <div
                        className='absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl transition-all duration-100 opacity-90'
                        style={{ width: `${volume}%` }}
                    />
                    <Volume2 className='w-4 h-4 relative z-10 text-white drop-shadow-sm pointer-events-none' />
                    <input
                        type='range'
                        min='0'
                        max='100'
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20'
                    />
                </div>
            </div>

            {/* Now Playing Lo-Fi Module */}
            <div
                className={clsx(
                    'rounded-2xl p-2.5 flex items-center justify-between border transition-colors',
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'
                )}
            >
                <div className='flex items-center gap-2.5 min-w-0'>
                    <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white shadow-xs flex-shrink-0'>
                        <Music className='w-4 h-4' />
                    </div>
                    <div className='min-w-0 leading-tight'>
                        <span className='text-xs font-bold block truncate'>Asif's Dev Session</span>
                        <span className='text-[9.5px] opacity-65 block truncate'>
                            Lo-Fi Beats • Coding Chill
                        </span>
                    </div>
                </div>
                <button
                    type='button'
                    onClick={() => setIsPlaying(!isPlaying)}
                    className='w-7 h-7 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0'
                >
                    {isPlaying ? <Pause className='w-3.5 h-3.5' /> : <Play className='w-3.5 h-3.5 ml-0.5' />}
                </button>
            </div>
        </aside>
    );
};

export default ControlCenter;
