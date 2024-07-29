"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {useState} from "react";
import {useScopedI18n} from "@/locales/client";
import {useAuth} from "@/components/contexts/AuthContext";
import {Button} from "@/components/ui/button";
import {Globe, Paintbrush, Pencil, TypeOutline, User} from "lucide-react";
import {EditProfile} from "@/components/settings/EditProfile";
import {EditLanguage} from "@/components/settings/EditLanguage";
import {EditFontSize} from "@/components/settings/EditFontSize";
import {GetCurrentFontSize, GetCurrentLanguage, GetCurrentTheme} from "@/lib/utils";
import {EditTheme} from "@/components/settings/EditTheme";
import {useApp} from "@/components/contexts/AppContext";

export default function Settings() {
    const t = useScopedI18n('settings');
    const {user} = useAuth()

    const [openEditProfile, setOpenEditProfile] = useState(false)
    const [openEditLanguage, setOpenEditLanguage] = useState(false)
    const [openEditFontSize, setOpenEditFontSize] = useState(false)
    const [openEditTheme, setOpenEditTheme] = useState(false)

    const {currentTheme} = useApp()

    return (
        <PageContainer title={t('title')}>

            <div className={'flex flex-col divide-y -mx-6 last:border-0'}>

                {/* Profile */}
                <SettingsMenu
                    icon={<User className={'w-5 h-5 text-primary'}/>}
                    label={t('profile.title')}
                    settingsValue={user?.name}
                    toggleEdit={()=> setOpenEditProfile(true)}
                />

                {/* Language */}
                <SettingsMenu
                    icon={<Globe className={'w-5 h-5 text-primary'}/>}
                    label={t('language.title')}
                    settingsValue={t(`language.${GetCurrentLanguage(user?.prefs?.lang || "ur")}`)}
                    toggleEdit={()=> setOpenEditLanguage(true)}
                />

                {/* Font Size */}
                <SettingsMenu
                    icon={<TypeOutline className={'w-5 h-5 text-primary'}/>}
                    label={t('fontSize.title')}
                    settingsValue={t(`fontSize.${GetCurrentFontSize(user?.prefs?.fontSize || "base" )}`)}
                    toggleEdit={()=> setOpenEditFontSize(true)}
                />

                {/* Theme */}
                <SettingsMenu
                    icon={<Paintbrush className={'w-5 h-5 text-primary'}/>}
                    label={t('theme.label')}
                    settingsValue={t(GetCurrentTheme(currentTheme).label)}
                    toggleEdit={()=> setOpenEditTheme(true)}
                />

            </div>

            <div className={'px-6 py-8 gap-2 text-center mt-10 text-sm text-muted-foreground'}>
                App Version <span className={'font-semibold'}>3.2.1</span>
            </div>

            <EditProfile open={openEditProfile} onOpenChange={setOpenEditProfile} />
            <EditLanguage open={openEditLanguage} onOpenChange={setOpenEditLanguage} />
            <EditFontSize open={openEditFontSize} onOpenChange={setOpenEditFontSize} />
            <EditTheme open={openEditTheme} onOpenChange={setOpenEditTheme} />

        </PageContainer>
    );
}

const SettingsMenu = ({icon, label, settingsValue, toggleEdit}) =>{
    return(
        <div className={'flex flex-col px-6 py-6 gap-4 cursor-pointer hover:bg-muted'} onClick={toggleEdit}>

            <div className={'flex items-center gap-4'}>
                {icon}
                <UIText text={label} weight={'medium'} className={'text-muted-foreground'}/>
                <Button
                    size={'ghost'}
                    className={'rtl:mt-3 rounded-md ml-auto p-2'}
                    // onClick={toggleEdit}
                    variant={'ghost'}
                >
                    <Pencil className={'w-4 h-4'}/>
                </Button>
            </div>

            <div className={'flex flex-col gap-2 px-9'}>
                <UIText text={settingsValue} weight={'semibold'}/>
            </div>

        </div>
    )
}
