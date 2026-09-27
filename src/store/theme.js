import { create } from 'zustand';

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('macos-theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return 'dark'; // default to standard dark wallpaper
    }
    return 'dark';
};

const useThemeStore = create((set) => ({
    theme: getInitialTheme(),
    isControlCenterOpen: false,
    toggleTheme: () =>
        set((state) => {
            const next = state.theme === 'dark' ? 'light' : 'dark';
            if (typeof window !== 'undefined') {
                localStorage.setItem('macos-theme', next);
                if (next === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                }
            }
            return { theme: next };
        }),
    setTheme: (theme) =>
        set(() => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('macos-theme', theme);
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                }
            }
            return { theme };
        }),
    toggleControlCenter: () => set((state) => ({ isControlCenterOpen: !state.isControlCenterOpen })),
    closeControlCenter: () => set({ isControlCenterOpen: false }),
}));

export default useThemeStore;
