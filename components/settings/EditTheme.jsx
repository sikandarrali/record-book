"use client";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {cn, GetCurrentTheme} from "@/lib/utils";
import {useState} from "react";
import { useMediaQuery } from "react-responsive";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {account} from "@/components/appwrite/appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import UIText from "@/components/theme/UIText";
import {useChangeLocale, useCurrentLocale, useScopedI18n} from "@/locales/client";
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {UISheetFooterWithAction} from "@/components/theme/UISheetFooterWithAction";
import {useRouter} from "next/navigation";
import {COOKIE_THEME_NAME, DEFAULT_THEME, LOCAL_STORAGE_THEME_NAME_ITEM} from "@/lib/defaults";
import Cookies from "js-cookie";
import {useData} from "@/components/contexts/DataContext";
import {UISheet} from "@/components/theme/UISheet";
import {SupportedThemes} from "@/lib/defaultData";


export const EditTheme = ({ open, onOpenChange }) => {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1024px)",
    });

    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const {user, setUser} = useAuth()
    const t = useScopedI18n('settings.theme');
    const locale = useCurrentLocale();
    const {currentTheme, setCurrentTheme} = useData()

    const [openThemeDropdown, setOpenThemeDropdown] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState(user?.prefs?.theme || DEFAULT_THEME)

    const tempCurrentTheme = currentTheme;

    const onUpdate = async (values) => {
        setAdding(true);
        setDisabled(true);
        const userPrefs = user?.prefs;

        if(currentTheme !== selectedTheme){
            try {
                setCurrentTheme(selectedTheme);

                let prefs = {...userPrefs, theme: selectedTheme}
                const response =  await account.updatePrefs(prefs)

                document.body.classList.remove(tempCurrentTheme)
                localStorage.setItem(COOKIE_THEME_NAME, selectedTheme)

                toast.success(t('alertUpdated'), ToastOptions);
                // if(response){
                //     setTimeout(()=>{
                //         window.location.reload();
                //     }, 500)
                // }
            }
            catch (e){
                toast.error(t('alertException'))
            }
        }else{
            toast.info(t('alertNoChanges'), ToastOptions);
        }

        setAdding(false);
        setDisabled(false);
        onOpenChange(false);
    };

    return (
        <UISheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <div className="flex flex-col flex-1 w-full pt-4 justify-start min-h-[200px]">
                <div className="flex items-center space-x-2 justify-between mb-4">
                    <UIText variant={'heading'} className="text-primary" text={t('editTitle')}/>
                </div>
                <div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
                    <Popover open={openThemeDropdown} onOpenChange={setOpenThemeDropdown}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between py-4"
                            >
                                {selectedTheme
                                    ? <UIText text={t(GetCurrentTheme(selectedTheme).label)}/>
                                    : <UIText text={t('editTitle')}/>}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side={'top'} className="p-0">
                            <Command>
                                {/*<CommandInput placeholder={<UIText text={t('search')}/>} />*/}
                                {/*<CommandEmpty><UIText text={t('noFontSizesFound')}/> </CommandEmpty>*/}
                                <CommandList>
                                    <CommandGroup>
                                        {SupportedThemes.map((theme)=>(
                                            <CommandItem
                                                key={theme.value}
                                                value={theme.value}
                                                onSelect={(currentValue) => {
                                                    setSelectedTheme(currentValue === selectedTheme ? "" : currentValue)
                                                    setOpenThemeDropdown(false)
                                                }}
                                                className={cn(
                                                    'gap-4',
                                                    selectedTheme === theme.value && "!text-primary"
                                                )}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-5 w-5 rtl:mt-1.5 stroke-[2.5]",
                                                        selectedTheme === theme.value ? "opacity-100" : "opacity-0",
                                                    )}
                                                />
                                                <div className={'w-6 h-6'} style={{background: theme.accentColor}} />
                                                <UIText weight={selectedTheme === theme.value && "semibold"} text={t(theme.label)}/>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className={'mt-auto'}>
                <UISheetFooterWithAction
                    adding={adding}
                    disabled={disabled}
                    onOpenChange={onOpenChange}
                    onSubmit={onUpdate}
                />
            </div>
        </UISheet>
    );
};
