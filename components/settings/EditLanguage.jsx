"use client";
import {cn, GetCurrentLanguage} from "@/lib/utils";
import {useState} from "react";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {account} from "@/components/appwrite/appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import UIText from "@/components/theme/UIText";
import {useChangeLocale, useCurrentLocale, useScopedI18n} from "@/locales/client";
import {SupportedLanguages} from "@/lib/defaultData";
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {UISheetFooterWithAction} from "@/components/theme/UISheetFooterWithAction";
import {UISheet} from "@/components/theme/UISheet";


export const EditLanguage = ({ open, onOpenChange }) => {
    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const {user, setUser} = useAuth()
    const t = useScopedI18n('settings.language');
    const locale = useCurrentLocale();
    const ChangeLocale = useChangeLocale();

    const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState(user?.prefs?.lang || "ur")

    const onUpdate = async (values) => {
        setAdding(true);
        setDisabled(true);
        const userPrefs = user?.prefs;

        if(locale !== selectedLanguage){
            try {
                let prefs = {...userPrefs, lang: selectedLanguage}
                const response =  await account.updatePrefs(prefs)
                toast.success(t('alertSuccess'), ToastOptions);
                if(response){
                    ChangeLocale(selectedLanguage)
                }
            }
            catch (e){
                toast.error(t('alertException'))
            }
        }else{
            toast.info(t('alertNothingToUpdate'), ToastOptions);
        }

        setAdding(false);
        setDisabled(false);
        onOpenChange(false);
    };


    return (
        <UISheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <div className="flex flex-col flex-1 w-full pt-4 justify-start min-h-[200px]">
                <div className="flex items-center space-x-2 justify-between mb-4">
                    <UIText variant={'heading'} className="text-primary" text={t('change')}/>
                </div>
                <div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
                    <Popover open={openLanguageDropdown} onOpenChange={setOpenLanguageDropdown}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between py-4"
                            >
                                {selectedLanguage
                                    ? <UIText text={t(GetCurrentLanguage(selectedLanguage))}/>
                                    : <UIText text={t('selectLanguage')}/>}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side={'top'} className="p-0">
                            <Command>
                                {/*<CommandInput placeholder={t('search')} />*/}
                                {/*<CommandEmpty><UIText text={t('noLanguagesFound')}/> </CommandEmpty>*/}
                                <CommandList>
                                    <CommandGroup>
                                        {SupportedLanguages.map((language) => (
                                            <CommandItem
                                                key={language.value}
                                                value={language.value}
                                                onSelect={(currentValue) => {
                                                    setSelectedLanguage(currentValue === selectedLanguage ? "" : currentValue)
                                                    setOpenLanguageDropdown(false)
                                                }}
                                                className={cn(
                                                    'gap-4',
                                                    selectedLanguage === language.value && "!text-primary"
                                                )}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-5 w-5 rtl:mt-1.5 stroke-[2.5]",
                                                        selectedLanguage === language.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <UIText weight={selectedLanguage === language.value && "semibold"} text={t(language.value)}/>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                                </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <UISheetFooterWithAction
                adding={adding}
                disabled={disabled}
                onOpenChange={onOpenChange}
                onSubmit={onUpdate}
            />
        </UISheet>
    );
};
