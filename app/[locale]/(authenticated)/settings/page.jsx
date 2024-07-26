"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {useRef, useState} from "react";
import {useScopedI18n} from "@/locales/client";
import {useAuth} from "@/components/contexts/AuthContext";
import {Button} from "@/components/ui/button";
import {Globe, Paintbrush, Pencil, TypeOutline, User} from "lucide-react";
import {EditProfile} from "@/components/settings/EditProfile";
import {EditLanguage} from "@/components/settings/EditLanguage";
import {EditFontSize} from "@/components/settings/EditFontSize";
import {SupportedLanguages} from "@/lib/defaultData";
import {GetCurrentFontSize, GetCurrentLanguage, GetCurrentTheme, ResolveCurrentTheme} from "@/lib/utils";
import {UITextInput} from "@/components/theme/UITextInput";
import {EditTheme} from "@/components/settings/EditTheme";
import {APP_THEME, COOKIE_THEME_NAME, DEFAULT_THEME} from "@/lib/defaults";
import {themesData} from "@/lib/themesData";
import Cookies from "js-cookie";
import {useData} from "@/components/contexts/DataContext";

export default function Settings() {
    const t = useScopedI18n('settings');
    const {user} = useAuth()

    const [openEditProfile, setOpenEditProfile] = useState(false)
    const [openEditLanguage, setOpenEditLanguage] = useState(false)
    const [openEditFontSize, setOpenEditFontSize] = useState(false)
    const [openEditTheme, setOpenEditTheme] = useState(false)

    const {currentTheme} = useData()

    return (
        <PageContainer hideTopbar>

            <UIText variant="heading" className={'!text-primary mb-8'} text={t('title')}/>

            <div className={'flex flex-col gap-6'}>
                {/* Profile */}
                <div className={'flex items-center justify-between -mx-6 px-6 pb-6 border-b border-b-accent-foreground gap-2'}>
                    <div className={'flex items-center gap-4'}>
                        <User className={'w-5 h-5 text-primary'}/>
                        <UIText text={t('profile.title')} weight={'semibold'} className={''}/>
                    </div>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText className={'!text-primary'} text={user?.name} weight={'medium'}/>

                        <Button
                            size={'icon'}
                            className={'border rtl:mt-3 rounded-md border-accent-foreground bg-accent dark:bg-accent-foreground group'}
                            onClick={()=> setOpenEditProfile(true)}
                        >
                            <Pencil className={'w-5 h-5 text-accent-foreground dark:text-accent group-hover:text-primary'}/>
                        </Button>
                    </div>
                </div>

                {/* Language */}
                <div className={'flex items-center justify-between -mx-6 px-6 pb-6 border-b border-b-accent-foreground gap-2'}>
                    <div className={'flex items-center gap-4'}>
                        <Globe className={'w-5 h-5 text-primary'}/>
                        <UIText text={t('language.title')} weight={'semibold'} className={''}/>
                    </div>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText className={'!text-primary'} text={t(`language.${GetCurrentLanguage(user?.prefs?.lang || "ur")}`)} weight={'medium'}/>

                        <Button
                            size={'icon'}
                            className={'border rtl:mt-3 rounded-md border-accent-foreground bg-accent dark:bg-accent-foreground group'}
                            onClick={()=> setOpenEditLanguage(true)}
                        >
                            <Pencil className={'w-5 h-5 text-accent-foreground dark:text-accent group-hover:text-primary'}/>
                        </Button>
                    </div>
                </div>

                {/* Font Size */}
                <div className={'flex items-center justify-between -mx-6 px-6 pb-6 border-b border-b-accent-foreground gap-2'}>
                    <div className={'flex items-center gap-4'}>
                        <TypeOutline className={'w-5 h-5 text-primary'}/>
                        <UIText text={t('fontSize.title')} weight={'semibold'} className={''}/>
                    </div>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText className={'!text-primary'} text={t(`fontSize.${GetCurrentFontSize(user?.prefs?.fontSize || "base" )}`)} weight={'medium'}/>

                        <Button
                            size={'icon'}
                            className={'border rtl:mt-3 rounded-md border-accent-foreground bg-accent dark:bg-accent-foreground group'}
                            onClick={()=> setOpenEditFontSize(true)}
                        >
                            <Pencil className={'w-5 h-5 text-accent-foreground dark:text-accent group-hover:text-primary'}/>
                        </Button>
                    </div>
                </div>

                {/* Theme */}
                <div className={'flex items-center justify-between -mx-6 px-6 pb-6 gap-2'}>
                  <div className={'flex items-center gap-4'}>
                      <Paintbrush className={'w-5 h-5 text-primary'}/>
                      <UIText text={t('theme.label')} weight={'semibold'} className={''}/>
                  </div>

                  <div className={'flex justify-between items-center gap-4'}>
                      <UIText className={'!text-primary'} text={t(`theme.${GetCurrentTheme(currentTheme)}`)} weight={'medium'}/>

                      <Button
                          size={'icon'}
                          className={'border rtl:mt-3 rounded-md border-accent-foreground bg-accent dark:bg-accent-foreground group'}
                          onClick={()=> setOpenEditTheme(true)}
                      >
                          <Pencil className={'w-5 h-5 text-accent-foreground dark:text-accent group-hover:text-primary'}/>
                      </Button>
                  </div>
                </div>

                <div className={'-mx-6 px-6 pb-6 gap-2 text-center mt-10 text-sm text-muted-foreground'}>
                  App Version <span className={'font-semibold'}>3.3</span>
                </div>
            </div>

            <EditProfile open={openEditProfile} onOpenChange={setOpenEditProfile} />
            <EditLanguage open={openEditLanguage} onOpenChange={setOpenEditLanguage} />
            <EditFontSize open={openEditFontSize} onOpenChange={setOpenEditFontSize} />
            <EditTheme open={openEditTheme} onOpenChange={setOpenEditTheme} />

        </PageContainer>
    );
}
