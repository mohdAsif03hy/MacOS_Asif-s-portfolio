import { WindowControlls } from '#components';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window.js'
import React from 'react'

const Text = () => {
    const textfile = useWindowStore((state) => state.windows.txtfile);

    const data = textfile?.data;

    if (!data) {
        return <div className="p-4 text-gray-400">No file selected</div>;
    }

    const { name ,image , subtitle, description } = data;

  return (
    <>
    <div id='window-header'>
        <WindowControlls target='txtfile'/>
        <h2>{name}</h2>
      
    </div>
    <div className='p-5 space-y-6 bg-white flex-1 overflow-y-auto'>
        {
            image ? (
                <div className='w-full'>
                    <img src={image} alt={name} className='w-full h-auto rounded' />
                </div>
            ) : null
        }
        {subtitle ? <h3 className='text-lg font-semibold '>{subtitle}</h3> : null}
        {Array.isArray(description) && description.length > 0 ? (
            <div className='space-y-3 leading-relaxed text-base text-gray-800 '>
                {description.map((para, idx)=>(
                    <p key={idx}>{para}</p>
                ))}
            </div>
        ): null} 
    </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, "txtfile");

export default TextWindow;
