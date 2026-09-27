import { WindowControlls } from '#components';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import React from 'react';

const Image = () => {

    // ✅ correct store access
    const imgfile = useWindowStore((state) => state.windows.imgfile);

    const data = imgfile?.data;

    if (!data) {
        return <div className="p-4 text-gray-400">No image selected</div>;
    }

    const { name, imageUrl, image } = data;

    const src = imageUrl || image;

    return (
        <>
            <div id='window-header'>
                <WindowControlls target='imgfile' />
                <h2>{name}</h2>
            </div>
            <div className='p-5 bg-white'>
                {src && (
                    <div className='w-full'>
                        <img
                            src={src}
                            alt={name}
                            className='w-full h-auto max-h-[60vh] object-contain rounded'
                        />
                    </div>
                )}
            </div>
        </>
    );
};

// ✅ correct wrapper
const ImageWindow = WindowWrapper(Image, "imgfile");

export default ImageWindow;