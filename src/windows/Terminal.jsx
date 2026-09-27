import { WindowControlls } from '#components';
import { techStack } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { Check, Flag, Terminal as TerminalIcon, RotateCcw } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const FULL_COMMAND = 'show tech stack';

const Terminal = () => {
    const isTerminalOpen = useWindowStore((state) => state.windows.terminal?.isOpen);

    const [typedCommand, setTypedCommand] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [step, setStep] = useState(0); // 0: typing, 1: executing, 2: streaming categories, 3: completed
    const [renderedCount, setRenderedCount] = useState(0);
    const [showFootnote, setShowFootnote] = useState(false);
    const [showBottomPrompt, setShowBottomPrompt] = useState(false);

    const runSequence = () => {
        setTypedCommand('');
        setIsTyping(true);
        setStep(0);
        setRenderedCount(0);
        setShowFootnote(false);
        setShowBottomPrompt(false);

        let charIndex = 0;
        const typingInterval = setInterval(() => {
            if (charIndex < FULL_COMMAND.length) {
                setTypedCommand(FULL_COMMAND.slice(0, charIndex + 1));
                charIndex++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
                setStep(1); // Executing

                setTimeout(() => {
                    setStep(2); // Streaming categories
                    let count = 0;
                    const catInterval = setInterval(() => {
                        count++;
                        setRenderedCount(count);
                        if (count >= techStack.length) {
                            clearInterval(catInterval);
                            setTimeout(() => {
                                setShowFootnote(true);
                                setTimeout(() => {
                                    setShowBottomPrompt(true);
                                    setStep(3);
                                }, 300);
                            }, 250);
                        }
                    }, 110);
                }, 200);
            }
        }, 55);

        return () => {
            clearInterval(typingInterval);
        };
    };

    // Auto-run animation whenever the Terminal window opens
    useEffect(() => {
        if (isTerminalOpen) {
            const cleanup = runSequence();
            return cleanup;
        }
    }, [isTerminalOpen]);

    return (
        <>
            <div id='window-header'>
                <WindowControlls target='terminal' />
                <div className='flex items-center gap-2'>
                    <TerminalIcon className='w-3.5 h-3.5 text-gray-500' />
                    <h2>asif@portfolio — zsh — 80x24</h2>
                </div>
                <button
                    type='button'
                    onClick={runSequence}
                    title='Rerun command'
                    className='text-gray-400 hover:text-black transition-colors p-0.5 rounded hover:bg-gray-200'
                >
                    <RotateCcw className='w-3.5 h-3.5' />
                </button>
            </div>

            <div className='techstack'>
                {/* Auto-Typed Command Line */}
                <p className='flex items-center gap-1.5'>
                    <span className='font-bold text-gray-900'>@asif %</span>
                    <span>{typedCommand}</span>
                    {isTyping && (
                        <span className='inline-block w-2 h-4 bg-gray-900 animate-pulse ml-0.5 align-middle'></span>
                    )}
                </p>

                {/* Staged Output Table */}
                {step >= 2 && (
                    <div className='animate-fadeIn transition-opacity duration-300'>
                        <div className='label'>
                            <p className='w-32'>Category</p>
                            <p>Technologies</p>
                        </div>

                        <ul className='content'>
                            {techStack.slice(0, renderedCount).map(({ category, items }) => (
                                <li className='flex items-center animate-fadeIn' key={category}>
                                    <Check className='check' size={20} />
                                    <h3>{category}</h3>
                                    <ul>
                                        {items.map((item, i) => (
                                            <li key={i}>
                                                {item}
                                                {i < items.length - 1 ? ',' : ''}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Footnote Stats */}
                {showFootnote && (
                    <div className='footnote animate-fadeIn'>
                        <p className='flex items-center'>
                            <Check size={20} /> {techStack.length} of {techStack.length} stacks loaded successfully (100%)
                        </p>
                        <p className='text-black flex items-center'>
                            <Flag size={15} fill='black' /> Render time ~3ms
                        </p>
                    </div>
                )}

                {/* Bottom Active Ready Prompt */}
                {showBottomPrompt && (
                    <p className='flex items-center gap-1.5 mt-3 pt-2.5 border-t border-dashed border-gray-200 text-gray-900 animate-fadeIn'>
                        <span className='font-bold'>@asif %</span>
                        <span className='inline-block w-2 h-4 bg-gray-900 animate-pulse ml-0.5 align-middle'></span>
                    </p>
                )}
            </div>
        </>
    );
};

const TerminalWindow = WindowWrapper(Terminal, 'terminal');

export default TerminalWindow;