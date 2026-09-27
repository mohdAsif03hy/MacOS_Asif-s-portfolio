import useWindowStore from '#store/window';
import React from 'react';
import { X, Minus, Plus, ChevronLeft } from 'lucide-react';

const WindowControlls = ({ target, label = 'Back' }) => {
  const { closeWindow } = useWindowStore();

  const handleClose = (e) => {
    e.stopPropagation();
    if (target) closeWindow(target);
  };

  return (
    <div id='window-controls' className='flex items-center select-none'>
      {/* 📱 Mobile iOS Back Button with chevron */}
      <button
        type='button'
        onClick={handleClose}
        aria-label={`Go back from ${label}`}
        className='sm:hidden flex items-center gap-0.5 text-blue-600 active:text-blue-800 text-xs font-semibold py-1 px-1.5 -ml-1 rounded-lg active:bg-blue-50 transition-colors cursor-pointer'
      >
        <ChevronLeft className='w-4 h-4 -mr-0.5' strokeWidth={2.8} />
        <span>{label}</span>
      </button>

      {/* 💻 Desktop macOS Traffic Light Dots */}
      <div className='max-sm:hidden group flex items-center gap-2'>
        <button
          type='button'
          className='close flex items-center justify-center cursor-pointer border-0 p-0'
          onClick={handleClose}
          title='Close'
          aria-label='Close window'
        >
          <X className='size-2 text-[#4d0000] opacity-0 group-hover:opacity-100 transition-opacity' strokeWidth={3.5} />
        </button>

        <button
          type='button'
          className='minimize flex items-center justify-center cursor-default border-0 p-0'
          title='Minimize'
          aria-label='Minimize window'
        >
          <Minus className='size-2 text-[#5c3a00] opacity-0 group-hover:opacity-100 transition-opacity' strokeWidth={3.5} />
        </button>

        <button
          type='button'
          className='maximize flex items-center justify-center cursor-default border-0 p-0'
          title='Maximize'
          aria-label='Maximize window'
        >
          <Plus className='size-2 text-[#004d1a] opacity-0 group-hover:opacity-100 transition-opacity' strokeWidth={3.5} />
        </button>
      </div>
    </div>
  );
};

export default WindowControlls;