import { SunIcon, MoonIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeSelector = () => {
    const { theme, setTheme } = useThemeStore();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "lofi" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title={`Switch to ${theme === "dark" ? "Lofi" : "Dark"} theme`}
        >
            {theme === "dark" ? (
                <SunIcon className="size-5" />
            ) : (
                <MoonIcon className="size-5" />
            )}
        </button>
    );
};
export default ThemeSelector;