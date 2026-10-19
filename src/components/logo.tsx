import { useTheme } from "../context/ThemeContext";
import { LOGO_LIGHT, LOGO_DARK } from "../constants/assets";

interface LogoProps {
    className?: string;
    alt?: string;
    dark?: boolean;
}

export function Logo({
    className = "h-7 w-auto object-contain",
    alt = "ReCiclo",
    dark,
}: LogoProps) {
    const { isDarkMode } = useTheme();
    const useDarkLogo = dark !== undefined ? dark : isDarkMode;

    return (
        <img
            src={useDarkLogo ? LOGO_DARK : LOGO_LIGHT}
            alt={alt}
            className={`select-none ${className}`}
        />
    );
}
