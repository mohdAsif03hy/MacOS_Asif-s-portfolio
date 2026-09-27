import React, { Suspense, lazy } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Navbar, Welcome, Dock, Home, IPhoneHome, LeetCodeWidget } from '#components';
import useWindowStore from '#store/window';

// 🚀 Dynamic Code-Splitting: Windows and heavy libraries load strictly on-demand
const Terminal = lazy(() => import('#windows/Terminal.jsx'));
const Safari = lazy(() => import('#windows/Safari.jsx'));
const Resume = lazy(() => import('#windows/Resume.jsx'));
const Finder = lazy(() => import('#windows/Finder.jsx'));
const Text = lazy(() => import('#windows/Text.jsx'));
const Image = lazy(() => import('#windows/Image.jsx'));
const Contact = lazy(() => import('#windows/Contact.jsx'));
const Photos = lazy(() => import('#windows/Photos.jsx'));
const Archive = lazy(() => import('#windows/Archive.jsx'));

gsap.registerPlugin(Draggable);

const App = () => {
    const windows = useWindowStore((state) => state.windows);

    return (
        <main className='relative w-dvw h-dvh overflow-hidden select-none'>
            <Navbar />
            <Welcome />
            <LeetCodeWidget />
            <IPhoneHome />
            <Dock />
            <Home />

            <Suspense fallback={null}>
                {(windows.terminal?.isOpen || windows.terminal?.hasBeenOpened) && <Terminal />}
                {(windows.safari?.isOpen || windows.safari?.hasBeenOpened) && <Safari />}
                {(windows.resume?.isOpen || windows.resume?.hasBeenOpened) && <Resume />}
                {(windows.finder?.isOpen || windows.finder?.hasBeenOpened) && <Finder />}
                {(windows.txtfile?.isOpen || windows.txtfile?.hasBeenOpened) && <Text />}
                {(windows.imgfile?.isOpen || windows.imgfile?.hasBeenOpened) && <Image />}
                {(windows.contact?.isOpen || windows.contact?.hasBeenOpened) && <Contact />}
                {(windows.photos?.isOpen || windows.photos?.hasBeenOpened) && <Photos />}
                {(windows.trash?.isOpen || windows.trash?.hasBeenOpened) && <Archive />}
            </Suspense>
        </main>
    );
};

export default App;
