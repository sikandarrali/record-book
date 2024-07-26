import { useState } from 'react';

const themes = {
    light: {
        '--background': '0 0% 100%',
        '--foreground': '20 14.3% 4.1%',
        // Add other variables...
    },
    dark: {
        '--background': '20 14.3% 4.1%',
        '--foreground': '60 9.1% 97.8%',
        // Add other variables...
    },
    // Add more themes if needed
};

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('light');

    const applyTheme = (themeName) => {
        const themeVariables = themes[themeName];
        Object.keys(themeVariables).forEach((key) => {
            document.documentElement.style.setProperty(key, themeVariables[key]);
        });
        setTheme(themeName);
    };

    return (
        <div>
            <button onClick={() => applyTheme('light')}>Light Theme</button>
            <button onClick={() => applyTheme('dark')}>Dark Theme</button>
            {/* Add more buttons for other themes if needed */}
        </div>
    );
};

export default ThemeSwitcher;
