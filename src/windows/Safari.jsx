import { WindowControlls } from '#components'
import { blogPosts } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import { ChevronLeft, PanelLeft , ChevronRight, ShieldHalf, Search, Share, Plus, Copy, MoveRight} from 'lucide-react';
import React from 'react'

const Safari = () => {
  return (
    <>
    <div id='window-header'>
        <WindowControlls target='safari'/>
        <PanelLeft className='ml-10 icon max-sm:hidden'/>
        <div className='flex items-center gap-1 ml-5 max-sm:hidden'>
            <ChevronLeft className='icon'/>
            <ChevronRight className='icon'/>
        </div>
        <div className='flex-1 flex-center gap-3'> 
            <ShieldHalf className='icon max-sm:hidden'/>
            <div className='search'>
                <Search className='icon'/>
                <input type="text" placeholder='Search articles or posts...' className='flex-1 ' />
            </div>
        </div>
        <div className='flex items-center gap-5 max-sm:hidden'>
            <Share className='icon'/>
            <Plus className='icon'/>
            <Copy className='icon'/>
        </div>
    </div>

    <div className='blog'>
        <h2>My Developer Blog</h2>
        <div className='space-y-3'>
            {blogPosts.map(({id, image, title, date, link})=>(
                <div key={id} className='blog-post'>
                    <div className='col-span-2'>
                        <img src={image} alt={title} />
                    </div>
                    <div className='content'>
                        <p>{date}</p>
                        <h3>{title}</h3>
                        <a href={link} target='_blank' rel='noopener noreferrer'>
                            Check out the full post <MoveRight className='icon-hover'/>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    </div>
    </>
  );
};

const SafariWindow = WindowWrapper(Safari,"safari");
export default SafariWindow;
