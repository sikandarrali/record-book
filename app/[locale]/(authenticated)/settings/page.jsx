"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {useRef, useState} from "react";
import {useScopedI18n} from "@/locales/client";
import {useAuth} from "@/components/contexts/AuthContext";
import {Button} from "@/components/ui/button";
import {Globe, Paintbrush, Pencil, TypeOutline} from "lucide-react";
import {EditProfile} from "@/components/settings/EditProfile";
import {EditLanguage} from "@/components/settings/EditLanguage";
import {EditFontSize} from "@/components/settings/EditFontSize";
import {SupportedLanguages} from "@/lib/defaultData";
import {GetCurrentFontSize, GetCurrentLanguage} from "@/lib/utils";
import {UITextInput} from "@/components/theme/UITextInput";
import {EditTheme} from "@/components/settings/EditTheme";

export default function Settings() {
    const t = useScopedI18n('settings');
    const {user} = useAuth()

    const [openEditProfile, setOpenEditProfile] = useState(false)
    const [openEditLanguage, setOpenEditLanguage] = useState(false)
    const [openEditFontSize, setOpenEditFontSize] = useState(false)
    const [openEditTheme, setOpenEditTheme] = useState(false)


    return (
        <PageContainer hideTopbar>

            <UIText variant="heading" className={'text-primary mb-8'} text={t('title')}/>

            <div className={'flex flex-col gap-6'}>
                {/* Profile */}
                <div className={'flex flex-col -mx-6 px-6 pb-6 border-b gap-2'}>
                    <UIText text={t('profile.title')} weight={'semibold'} className={'text-primary'}/>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText text={user?.name} weight={'medium'}/>
                        <Button
                            size={'icon'}
                            variant={'ghost'}
                            className={'border rtl:mt-3'}
                            onClick={()=> setOpenEditProfile(true)}
                        >
                            <Pencil className={'w-5 h-5 text-primary'}/>
                        </Button>
                    </div>
                </div>

                {/* Language */}
                <div className={'flex flex-col -mx-6 px-6 pb-6 border-b gap-2'}>
                    <UIText text={t('language.title')} weight={'semibold'} className={'text-primary'}/>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText text={t(`language.${GetCurrentLanguage(user?.prefs?.lang || "ur")}`)} weight={'medium'}/>
                        <Button
                            size={'icon'}
                            variant={'ghost'}
                            className={'border rtl:mt-3'}
                            onClick={()=> setOpenEditLanguage(true)}
                        >
                            <Globe className={'w-5 h-5 text-primary'}/>
                        </Button>
                    </div>
                </div>

                {/* Font Size */}
                <div className={'flex flex-col -mx-6 px-6 pb-6 border-b gap-2'}>
                    <UIText text={t('fontSize.title')} weight={'semibold'} className={'text-primary'}/>

                    <div className={'flex justify-between items-center gap-4'}>
                        <UIText text={t(`fontSize.${GetCurrentFontSize(user?.prefs?.fontSize || "base" )}`)} weight={'medium'}/>
                        <Button
                            size={'icon'}
                            variant={'ghost'}
                            className={'border rtl:mt-3'}
                            onClick={()=> setOpenEditFontSize(true)}
                        >
                            <TypeOutline className={'w-5 h-5 text-primary'}/>
                        </Button>
                    </div>
                </div>

                {/* Theme */}
                <div className={'flex flex-col -mx-6 px-6 pb-6 gap-2'}>
                  <UIText text={t('theme.label')} weight={'semibold'} className={'text-primary'}/>

                  <div className={'flex justify-between items-center gap-4'}>
                      <UIText text={t(`theme.${GetCurrentFontSize(user?.prefs?.fontSize || "base" )}`)} weight={'medium'}/>
                      <Button
                          size={'icon'}
                          variant={'ghost'}
                          className={'border rtl:mt-3'}
                          onClick={()=> setOpenEditTheme(true)}
                      >
                          <Paintbrush className={'w-5 h-5 text-primary'}/>
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
