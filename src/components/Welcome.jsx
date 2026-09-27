import React, { useRef } from 'react'
import gsap from "gsap";
import { useGSAP } from '@gsap/react';

const FONT_WEIGHT = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 }
};

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? '\u00A0' : char}
        </span>
    ));
};

const setupTextHover = (container, type) => {
    if (!container) return ()=>{};

    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHT[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: 'power3.out',
            overwrite: "auto", // ⚡ important
            fontVariationSettings: `'wght' ${weight}`,
        });
    };

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));

            const intensity = Math.exp(-(distance ** 2) / 25000);

            const weight = min + (max - min) * intensity;

            animateLetter(letter, weight);
        });
    };

    // 🔥 PREMIUM RESET ANIMATION
    const handleMouseLeave = () => {
        gsap.to(letters, {
            fontVariationSettings: `'wght' ${base}`,
            duration: 0.5,
            ease: "power2.out",
            stagger: {
                each: 0.02,
                from: "center" // 🔥 center se reset hoga (premium feel)
            }
        });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    };
};

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current, 'title');
        const subtitleCleanup = setupTextHover(subtitleRef.current, 'subtitle');

        return () => {
            titleCleanup && titleCleanup();
            subtitleCleanup && subtitleCleanup();
        };
    }, []);

    return (
        <section id="welcome" className="max-sm:hidden h-screen flex flex-col justify-center items-center text-center px-4 select-none">

            <p ref={subtitleRef}>
                {renderText(
                    "Hey, I'm Mohd Asif! Welcome to my",
                    'text-xl sm:text-2xl lg:text-3xl font-georama text-white/90 drop-shadow-md',
                    100
                )}
            </p>

            <h1 ref={titleRef} className='mt-5 lg:mt-7'>
                {renderText("Portfolio", "text-7xl sm:text-8xl lg:text-9xl italic font-georama text-white drop-shadow-lg")}
            </h1>

        </section>
    );

};

export default Welcome;