import { WindowControlls } from '#components';
import { socials } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper'
import React from 'react'

const Contact = () => {
    return (
        <>
            <div id='window-header'>
                <WindowControlls target='contact'/>
                <h2>Contact Me</h2>
            </div>
            <div className='p-5 space-y-5 flex-1 overflow-y-auto'>
                <img src="/images/adrian.webp" alt="asif" className='w-20 h-20 rounded-full object-cover shadow-md ring-2 ring-blue-500/20' />
                <h3>Let's Connect</h3>
                <p>Got an idea? A bug squash? Or just wanna talk tech? I'm in.</p>
                <p>mohdasif70568@gmail.com</p>
                <ul>
                    {socials.map(({ id, bg, link, icon, text }) => (
                        <li key={id} style={{ backgroundColor: bg }}>
                            <a href={link} target='_blank' rel='noopener noreferrer' title={text}>
                                <img src={icon} alt={text} className='size-5 ' />
                                <p>{text}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
const ContactWindow = WindowWrapper(Contact, "contact");

export default ContactWindow;
