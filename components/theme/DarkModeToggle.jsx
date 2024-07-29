import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {Button} from "@/components/ui/button";
import {useApp} from "@/components/contexts/AppContext";

const modes = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    {id: "system", label: "System"}
];

export function DarkModeToggle() {
    const { theme, setTheme } = useTheme();
    const {setDarkMode, systemMode} = useApp()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'outline'} className="rounded-lg group cursor-pointer flex items-center justify-center select-none w-10 h-9 p-1">
                    <Sun className="w-6 h-6 flex dark:hidden" />
                    <Moon className="w-6 h-6 hidden dark:flex" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(selectedMode) => {
                        if (theme !== selectedMode) {
                            setTheme(selectedMode);
                        }
                        if(selectedMode === 'dark') {
                            setDarkMode(true)
                        }else if(selectedMode === 'light') {
                            setDarkMode(false)
                        }else {
                            if(selectedMode === "system" && systemMode) setDarkMode(true)
                            if(selectedMode === "system" && !systemMode) setDarkMode(false)
                        }
                    }}
                >
                    {modes.map((mode) => (
                        <DropdownMenuRadioItem
                            key={mode.id}
                            value={mode.id}
                            className="cursor-pointer"
                        >
                            <span>{mode.label}</span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
