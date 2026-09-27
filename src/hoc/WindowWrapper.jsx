import useWindowStore from '#store/window';
import { useGSAP } from '@gsap/react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, closeWindow, windows } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey] || { isOpen: false, zIndex: 1 };
        const [hasBeenOpened, setHasBeenOpened] = useState(isOpen);
        const ref = useRef(null);
        const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

        if (isOpen && !hasBeenOpened) {
            setHasBeenOpened(true);
        }

        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;
            el.style.display = 'block';

            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

            if (isMobile) {
                // 📱 iOS Mobile App Slide-Up with GPU-accelerated Spring Ease
                gsap.fromTo(
                    el,
                    { y: '100%', opacity: 0.8, scale: 0.97, force3D: true },
                    { y: '0%', opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out', force3D: true }
                );
            } else {
                // 💻 macOS Desktop Scale & Fade
                gsap.fromTo(
                    el,
                    { scale: 0.92, opacity: 0, force3D: true },
                    { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out', force3D: true }
                );
            }
        }, [isOpen]);

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;
            if (typeof window !== 'undefined' && window.innerWidth < 640) return;
            const header = el.querySelector('#window-header');
            const [instance] = Draggable.create(el, {
                trigger: header || el,
                bounds: 'body',
                edgeResistance: 0.65,
                onPress: () => focusWindow(windowKey),
            });
            return () => instance?.kill();
        }, []);

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            el.style.display = isOpen ? 'block' : 'none';
        }, [isOpen]);

        // 📱 Touch Gestures: Edge-Swipe Back & Pull-Down to dismiss on mobile
        const handleTouchStart = (e) => {
            if (typeof window !== 'undefined' && window.innerWidth >= 640) return;
            const touch = e.touches[0];
            touchStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now(),
            };
        };

        const handleTouchEnd = (e) => {
            if (typeof window !== 'undefined' && window.innerWidth >= 640) return;
            const touch = e.changedTouches[0];
            const diffX = touch.clientX - touchStartRef.current.x;
            const diffY = touch.clientY - touchStartRef.current.y;
            const timeDiff = Date.now() - touchStartRef.current.time;

            // 1. Swipe right from left edge (iOS Back Gesture)
            if (touchStartRef.current.x < 60 && diffX > 90 && Math.abs(diffY) < 120 && timeDiff < 400) {
                const el = ref.current;
                if (el) {
                    gsap.to(el, {
                        x: '100%',
                        opacity: 0,
                        duration: 0.22,
                        ease: 'power2.in',
                        force3D: true,
                        onComplete: () => {
                            gsap.set(el, { x: 0 });
                            closeWindow(windowKey);
                        },
                    });
                } else {
                    closeWindow(windowKey);
                }
                return;
            }

            // 2. Pull down from top bar to dismiss
            if (touchStartRef.current.y < 90 && diffY > 100 && Math.abs(diffX) < 100 && timeDiff < 400) {
                const el = ref.current;
                if (el) {
                    gsap.to(el, {
                        y: '100%',
                        opacity: 0,
                        duration: 0.22,
                        ease: 'power2.in',
                        force3D: true,
                        onComplete: () => {
                            gsap.set(el, { y: 0 });
                            closeWindow(windowKey);
                        },
                    });
                } else {
                    closeWindow(windowKey);
                }
            }
        };

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex, willChange: 'transform, opacity' }}
                onClick={() => focusWindow(windowKey)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className='absolute'
            >
                <div className='flex flex-col h-full w-full overflow-hidden'>
                    {(hasBeenOpened || isOpen) ? <Component {...props} /> : null}

                    {/* 📱 Mobile Bottom iOS Home Indicator bar (Tap to return to iPhone Home) */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            const el = ref.current;
                            if (el && typeof window !== 'undefined' && window.innerWidth < 640) {
                                gsap.to(el, {
                                    y: '100%',
                                    opacity: 0,
                                    duration: 0.22,
                                    ease: 'power2.in',
                                    force3D: true,
                                    onComplete: () => {
                                        gsap.set(el, { y: 0 });
                                        closeWindow(windowKey);
                                    },
                                });
                            } else {
                                closeWindow(windowKey);
                            }
                        }}
                        title='Tap to go Home'
                        className='sm:hidden w-full py-2 flex flex-col items-center justify-center bg-gray-50/95 backdrop-blur-md border-t border-gray-200/80 mt-auto cursor-pointer select-none active:bg-gray-200/80 transition-colors flex-none'
                    >
                        <div className='w-32 h-1.5 bg-neutral-800/40 rounded-full shadow-sm' />
                    </div>
                </div>
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
    return Wrapped;
};

export default WindowWrapper;
