import { WindowControlls } from '#components';
import { Search, Image as ImageIcon, X, ExternalLink, Users } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { gallery, photosLinks } from '#constants';
import useWindowStore from '#store/window';
import WindowWrapper from '#hoc/WindowWrapper';
import clsx from 'clsx';

const Photos = () => {
    const { openWindow } = useWindowStore();
    const [activeTab, setActiveTab] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const activeLink = useMemo(
        () => photosLinks.find((link) => link.id === activeTab) || photosLinks[0],
        [activeTab]
    );

    const currentPhotos = useMemo(() => {
        return gallery.filter((item) => {
            const matchesCategory = item.category === activeLink.title;
            const matchesSearch =
                searchQuery.trim() === '' ||
                (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.role || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeLink, searchQuery]);

    const handlePhotoClick = (item) => {
        // If it's in People category with LinkedIn URL, open LinkedIn directly
        if (item.linkedin) {
            window.open(item.linkedin, '_blank', 'noopener,noreferrer');
            return;
        }

        // Otherwise open image in viewer
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
            setSelectedPhoto(item);
        } else {
            openWindow('imgfile', {
                id: item.id,
                name: item.title || `${activeLink.title} image`,
                icon: '/images/image.webp',
                kind: 'file',
                fileType: 'img',
                imageUrl: item.img,
            });
        }
    };

    const isPeopleTab = activeLink.title === 'People';

    return (
        <div className='flex flex-col h-full w-full bg-white select-none overflow-hidden relative'>
            {/* Header Bar */}
            <div id='window-header' className='flex items-center justify-between px-3 py-2 border-b border-gray-200/80 bg-gray-50/90 backdrop-blur-md flex-none'>
                <WindowControlls target='photos' />
                <div className='flex items-center gap-1.5'>
                    {isPeopleTab ? (
                        <Users className='w-4 h-4 text-blue-600' />
                    ) : (
                        <ImageIcon className='w-4 h-4 text-blue-500' />
                    )}
                    <span className='font-semibold text-xs sm:text-sm text-gray-800 truncate'>
                        {isPeopleTab ? 'People & Friends Network' : activeLink.title}
                    </span>
                </div>

                <div className='flex items-center gap-2 text-gray-500'>
                    <div className='flex items-center gap-1 bg-gray-200/70 px-2 py-0.5 rounded-full border border-gray-300/40'>
                        <Search className='w-3 h-3 text-gray-500' />
                        <input
                            type='text'
                            placeholder='Search people or photos...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='text-[11px] bg-transparent outline-none w-20 sm:w-32 text-gray-800 placeholder:text-gray-400'
                        />
                    </div>
                </div>
            </div>

            {/* 📱 Mobile Horizontal Album Bar */}
            <div className='sm:hidden flex items-center gap-1 px-2.5 py-1.5 bg-gray-100/90 border-b border-gray-200 overflow-x-auto scrollbar-none flex-none touch-pan-x'>
                {photosLinks.map(({ id, title }) => (
                    <button
                        key={id}
                        type='button'
                        onClick={() => setActiveTab(id)}
                        className={clsx(
                            'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150',
                            id === activeTab
                                ? 'bg-blue-600 text-white shadow-sm scale-105'
                                : 'bg-white/80 text-gray-700 hover:bg-gray-200'
                        )}
                    >
                        {title}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className='flex flex-1 overflow-hidden min-h-0'>
                {/* 💻 Desktop Sidebar */}
                <div className='hidden sm:flex flex-col w-44 bg-gray-50/80 border-r border-gray-200 p-3 h-full flex-none overflow-y-auto'>
                    <h2 className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2'>
                        Photos Library
                    </h2>
                    <ul className='space-y-1'>
                        {photosLinks.map(({ id, icon, title }) => (
                            <li
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={clsx(
                                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors text-xs font-medium',
                                    id === activeTab
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-200/70'
                                )}
                            >
                                <img
                                    src={icon}
                                    alt={title}
                                    className={`w-3.5 h-3.5 ${id === activeTab ? 'brightness-0 invert' : ''}`}
                                />
                                <span>{title}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gallery / People Cards Grid */}
                <div className='flex-1 overflow-y-auto p-3 sm:p-4.5 bg-gray-50/60 flex flex-col justify-between'>
                    {currentPhotos.length > 0 ? (
                        <>
                            {isPeopleTab ? (
                                /* 👥 Apple Photos People Circular Profile Layout */
                                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4'>
                                    {currentPhotos.map((person) => {
                                        const initials = (person.title || '??')
                                            .trim()
                                            .split(/\s+/)
                                            .map((p) => p[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase();

                                        return (
                                            <div
                                                key={person.id}
                                                onClick={() => handlePhotoClick(person)}
                                                className='bg-white/95 rounded-2xl p-3.5 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-blue-400/80 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between text-center group active:scale-[0.98]'
                                            >
                                                {/* Circular Profile Avatar */}
                                                <div className='relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 ring-2 ring-blue-500/20 group-hover:ring-4 group-hover:ring-blue-500 transition-all duration-300 shadow-md group-hover:shadow-lg bg-gradient-to-b from-blue-50 to-white flex-shrink-0'>
                                                    <div className='w-full h-full rounded-full overflow-hidden relative flex items-center justify-center bg-gray-100'>
                                                        {person.img ? (
                                                            <img
                                                                src={person.img}
                                                                alt={person.title}
                                                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    if (e.target.nextSibling) {
                                                                        e.target.nextSibling.style.display = 'flex';
                                                                    }
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div
                                                            style={{ display: person.img ? 'none' : 'flex' }}
                                                            className='w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base sm:text-lg items-center justify-center tracking-wider select-none'
                                                        >
                                                            {initials}
                                                        </div>
                                                    </div>

                                                    {/* LinkedIn Circular Corner Badge */}
                                                    <span
                                                        className='absolute bottom-0 right-0 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#0a66c2] text-white p-1 border-2 border-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform'
                                                        title='LinkedIn Profile'
                                                    >
                                                        <img
                                                            src='/icons/linkedin.svg'
                                                            alt='LI'
                                                            className='w-full h-full brightness-0 invert'
                                                        />
                                                    </span>
                                                </div>

                                                {/* Person Info */}
                                                <div className='mt-2.5 w-full flex flex-col items-center'>
                                                    <h3
                                                        className='text-xs sm:text-[13px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 text-center'
                                                        title={person.title}
                                                    >
                                                        {person.title}
                                                    </h3>
                                                    <p
                                                        className='text-[10px] sm:text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5 text-center'
                                                        title={person.role}
                                                    >
                                                        {person.role || 'Developer & Colleague'}
                                                    </p>
                                                </div>

                                                {/* LinkedIn Direct Action Pill */}
                                                <a
                                                    href={person.linkedin}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    onClick={(e) => e.stopPropagation()}
                                                    className='mt-2.5 w-full py-1.5 px-2.5 rounded-full bg-[#0a66c2]/10 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white border border-[#0a66c2]/20 hover:border-transparent transition-all duration-200 text-[11px] font-semibold flex items-center justify-center gap-1 shadow-2xs'
                                                >
                                                    <img
                                                        src='/icons/linkedin.svg'
                                                        alt='LinkedIn'
                                                        className='w-3 h-3 brightness-0 opacity-80 group-hover:opacity-100 group-hover:invert'
                                                    />
                                                    <span>Connect</span>
                                                    <ExternalLink className='w-2.5 h-2.5 ml-0.5' />
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* 📸 Standard Photo Grid for Library / Memories / Places / Favorites */
                                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3'>
                                    {currentPhotos.map((item) => (
                                        <div
                                            key={item.id}
                                            title={item.title}
                                            onClick={() => handlePhotoClick(item)}
                                            className='group relative aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md border border-gray-200/60 active:scale-95 transition-all duration-150'
                                        >
                                            <img
                                                src={item.img}
                                                alt={item.title || `Gallery image ${item.id}`}
                                                loading='lazy'
                                                decoding='async'
                                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity p-2 flex items-end pointer-events-none'>
                                                <span className='text-white text-[10px] sm:text-xs font-medium truncate'>
                                                    {item.title}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Bottom Count Pill */}
                            <div className='text-center text-[11px] text-gray-400 py-3 mt-auto font-medium'>
                                {currentPhotos.length} {isPeopleTab ? 'People & Colleagues' : `Photos in ${activeLink.title}`}
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center flex-1 text-gray-400 py-12'>
                            <ImageIcon className='w-10 h-10 text-gray-300 mb-2' />
                            <p className='text-xs font-medium'>No entries found in {activeLink.title}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 📱 Mobile Fullscreen Lightbox Modal */}
            {selectedPhoto && (
                <div
                    onClick={() => setSelectedPhoto(null)}
                    className='sm:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fadeIn'
                >
                    <div className='flex items-center justify-between text-white pt-2'>
                        <span className='text-xs font-semibold truncate pr-2'>
                            {selectedPhoto.title}
                        </span>
                        <button
                            type='button'
                            onClick={() => setSelectedPhoto(null)}
                            className='p-1.5 bg-white/20 rounded-full active:bg-white/40'
                        >
                            <X className='w-4 h-4 text-white' />
                        </button>
                    </div>

                    <div className='flex-1 flex items-center justify-center my-auto overflow-hidden'>
                        <img
                            src={selectedPhoto.img}
                            alt={selectedPhoto.title}
                            className='max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10'
                        />
                    </div>

                    <div className='text-center text-[11px] text-white/60 pb-3'>
                        Tap anywhere to close
                    </div>
                </div>
            )}
        </div>
    );
};

const PhotosGallery = WindowWrapper(Photos, 'photos');

export default PhotosGallery;
