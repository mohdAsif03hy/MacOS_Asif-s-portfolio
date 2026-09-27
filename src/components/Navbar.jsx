import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { navLinks } from '#constants';
import useWindowStore from '#store/window';
import { Wifi, Search, User } from 'lucide-react';

const Navbar = () => {
    const { openWindow } = useWindowStore();
    const [time, setTime] = useState(dayjs().format('ddd MMM D h:mm A'));

    useEffect(() => {
        const updateTime = () => setTime(dayjs().format('ddd MMM D h:mm A'));
        const timer = setInterval(updateTime, 10000);
        return () => clearInterval(timer);
    }, []);

    const handleOpenAbout = () => {
        openWindow('finder');
    };

    return (
        <nav className='max-sm:hidden fixed top-0 left-0 right-0 z-40 h-8 flex justify-between items-center px-4 bg-black/25 backdrop-blur-2xl border-b border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.2)] text-white/90 select-none'>
            {/* Left Menu Items */}
            <div className='flex items-center gap-4 text-xs font-semibold'>
                <div className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'>
                    <img
                        src='/images/logo.svg'
                        alt='Apple Logo'
                        className='w-3.5 h-3.5 invert'
                    />
                    <span className='font-bold tracking-tight text-white'>Asif's MacBook</span>
                </div>
                <ul className='flex items-center gap-3.5'>
                    {navLinks.map(({ id, name, type }) => (
                        <li
                            key={id}
                            onClick={() => openWindow(type)}
                            className='cursor-pointer opacity-85 hover:opacity-100 hover:bg-white/10 px-2 py-0.5 rounded transition-all text-xs font-medium text-white/90'
                        >
                            <span>{name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Status Bar Controls */}
            <div className='flex items-center gap-2 text-xs'>
                {/* Wi-Fi Status */}
                <button
                    type='button'
                    title='Wi-Fi: Connected'
                    aria-label='Wi-Fi: Connected'
                    className='p-1 rounded hover:bg-white/10 transition-colors'
                >
                    <Wifi className='w-3.5 h-3.5 opacity-90 text-white' />
                </button>

                {/* Spotlight Search */}
                <button
                    type='button'
                    title='Spotlight Search'
                    aria-label='Spotlight Search'
                    onClick={() => openWindow('finder')}
                    className='p-1 rounded hover:bg-white/10 transition-colors'
                >
                    <Search className='w-3.5 h-3.5 opacity-90 text-white' />
                </button>

                {/* User Profile */}
                <button
                    type='button'
                    title='About Mohd Asif'
                    aria-label='About Mohd Asif'
                    onClick={handleOpenAbout}
                    className='p-1 rounded hover:bg-white/10 transition-colors'
                >
                    <User className='w-3.5 h-3.5 opacity-90 text-white' />
                </button>

                {/* Live Clock */}
                <time
                    dateTime={new Date().toISOString()}
                    className='font-sans text-xs font-semibold pl-1 tracking-tight cursor-default text-white/90'
                >
                    {time}
                </time>
            </div>
        </nav>
    );
};

export default Navbar;