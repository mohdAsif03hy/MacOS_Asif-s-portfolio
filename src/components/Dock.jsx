import React, { useRef } from 'react'
import { Tooltip } from 'react-tooltip';
import gsap from 'gsap';
import { dockApps } from '#constants';
import { useGSAP } from '@gsap/react';
import useWindowStore from '#store/window.js';


const Dock = () => {
    const { openWindow, closeWindow, focusWindow, windows } = useWindowStore();
    const dockRef = useRef(null);
    

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll('.dock-icon');
        let rafId = null;
        let iconCenters = [];
        let dockLeft = 0;

        const measurePositions = () => {
            const rect = dock.getBoundingClientRect();
            dockLeft = rect.left;
            iconCenters = Array.from(icons).map((icon) => {
                const iconRect = icon.getBoundingClientRect();
                return iconRect.left - dockLeft + iconRect.width / 2;
            });
        };

        const animateIcon = (mouseX) => {
            icons.forEach((icon, i) => {
                const center = iconCenters[i] || 0;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2.5) / 20000);
                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.15,
                    ease: 'power1.out',
                    force3D: true,
                    overwrite: 'auto',
                });
            });
        };

        const handleMouseEnter = () => {
            measurePositions();
        };

        const handleMouseMove = (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            const mouseX = e.clientX - dockLeft;
            rafId = requestAnimationFrame(() => animateIcon(mouseX));
        };

        const resetIcons = () => {
            if (rafId) cancelAnimationFrame(rafId);
            icons.forEach((icon) =>
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.25,
                    ease: 'power1.out',
                    force3D: true,
                    overwrite: 'auto',
                })
            );
        };

        dock.addEventListener('mouseenter', handleMouseEnter);
        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', resetIcons);
        window.addEventListener('resize', measurePositions);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            dock.removeEventListener('mouseenter', handleMouseEnter);
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', resetIcons);
            window.removeEventListener('resize', measurePositions);
        };
    }, []);

    const toggleApp = (app) => {
        if (!app.canOpen) return;

        if (app.externalLink) {
            window.open(app.externalLink, '_blank', 'noopener,noreferrer');
            return;
        }

        if (app.targetTab) {
            openWindow('trash', { tab: app.targetTab });
            focusWindow('trash');
            return;
        }

        const win = windows[app.id];
        if (win?.isOpen) {
            closeWindow(app.id);
        } else {
            openWindow(app.id);
        }
    };

    return (
        <section id='dock'>
            <div ref={dockRef} className='dock-container'>
                {dockApps.map((app) => (
                    <div key={app.id} className='relative flex justify-center'>
                        <button
                            type='button'
                            className='dock-icon'
                            aria-label={app.name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={app.name}
                            data-tooltip-delay-show={150}
                            disabled={!app.canOpen}
                            onClick={() => toggleApp(app)}
                        >
                            <img
                                src={`/images/${app.icon}`}
                                alt={app.name}
                                width={48}
                                height={48}
                                loading='lazy'
                                className={app.canOpen ? "" : "opacity-60"}
                            />
                        </button>
                    </div>
                ))}
                <Tooltip id="dock-tooltip" place='top' className='tooltip' />
            </div>
        </section>
    );
};

export default Dock
 