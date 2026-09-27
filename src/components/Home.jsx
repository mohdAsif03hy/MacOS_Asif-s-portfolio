import { locations } from '#constants';
import useLocationStore from '#store/location';
import useWindowStore from '#store/window';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { Draggable } from 'gsap/Draggable';
import React, { useRef } from 'react';

const Home = () => {
    const { setActiveLocation } = useLocationStore();
    const { openWindow } = useWindowStore();
    const isDraggingRef = useRef(false);

    const handleOpenProjectFinder = (project) => {
        // Prevent opening if the user was dragging the folder
        if (isDraggingRef.current) return;
        setActiveLocation(project);
        openWindow('finder');
    };

    const projects = locations.work?.children ?? [];

    useGSAP(() => {
        Draggable.create('.folder', {
            type: 'x,y',
            edgeResistance: 0.75,
            bounds: 'body',
            cursor: 'grab',
            activeCursor: 'grabbing',
            onPress: () => {
                isDraggingRef.current = false;
            },
            onDragStart: () => {
                isDraggingRef.current = true;
            },
            onDragEnd: () => {
                setTimeout(() => {
                    isDraggingRef.current = false;
                }, 100);
            },
        });
    }, []);

    return (
        <section id='home'>
            <ul>
                {projects.map((project) => (
                    <li
                        key={project.id}
                        className={clsx(
                            'group folder select-none flex flex-col items-center cursor-grab active:cursor-grabbing transition-transform duration-150',
                            project.windowPosition
                        )}
                        onClick={() => handleOpenProjectFinder(project)}
                        title={project.comingSoon ? `${project.name} (Coming Soon)` : project.name}
                    >
                        {/* Folder Icon Container with Premium macOS Squircle Badge */}
                        <div className='relative flex items-center justify-center p-1 rounded-xl group-hover:bg-white/10 dark:group-hover:bg-white/10 transition-colors'>
                            <img
                                src='/images/folder.webp'
                                alt={project.name}
                                width={56}
                                height={56}
                                className='w-14 h-14 object-contain pointer-events-none group-hover:scale-105 transition-transform duration-200 drop-shadow-md'
                            />

                            {/* 🌟 Premium Apple macOS Style Short "SOON" Glassmorphism Badge */}
                            {project.comingSoon && (
                                <span className='absolute -top-1 -right-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-[0_2px_10px_rgba(245,158,11,0.6)] border border-white/80 ring-1 ring-black/15 backdrop-blur-md animate-pulse'>
                                    SOON
                                </span>
                            )}
                        </div>

                        {/* Folder Label with macOS Blue Selection Pill on Hover */}
                        <p className='mt-1 text-xs text-white text-center font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] max-w-24 leading-tight group-hover:bg-blue-600 group-hover:text-white px-1.5 py-0.5 rounded-md transition-colors'>
                            {project.name}
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Home;
