import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("echomeet-theme") || "lofi",
    setTheme: (theme) => {
        localStorage.setItem("echomeet-theme", theme);
        set({ theme });
    },
}));