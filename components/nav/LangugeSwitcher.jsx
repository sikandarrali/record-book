//
// import {useLayoutEffect, useState} from "react";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import {account} from "@/components/appwrite/appwrite";
// import {toast} from "react-toastify";
// import {ToastOptions} from "@/lib/ToastOptions";
// import Cookies from "js-cookie";
//
// const languagesList = [
//     {id: 1, value: 'en', label: 'English'},
//     {id: 2, value: 'ur', label: 'Urdu'}
// ]
//
// const LanguageSwitcher = () =>{
//
//     const [language, setLanguage] = useState(languagesList[0])
//     const [preferences, setPreferences] = useState({})
//
//     useLayoutEffect(()=>{
//         return ()=> getPrefs()
//     },[])
//
//     const getPrefs = async () =>{
//         const prefs = await account.getPrefs();
//         if(prefs){
//             setPreferences(prefs)
//         }
//     }
//
//     const onLanguageChange = async (selected) =>{
//         let prefs = {...preferences, lang: selected}
//         setLanguage(selected)
//         const response = await account.updatePrefs(prefs)
//         console.log(response)
//         Cookies.set('skr-lang', response.prefs.lang)
//         toast.success("Language Updated", ToastOptions);
//     }
//
//     return(
//         <Select onValueChange={(selected)=> onLanguageChange(selected)}>
//             <SelectTrigger className="w-[100px] bg-muted font-semibold">
//                 <SelectValue placeholder={language.label} />
//             </SelectTrigger>
//             <SelectContent>
//                 {languagesList.map((lang)=>(
//                     <SelectItem value={lang.value} key={lang.value}>{lang.label}</SelectItem>
//                 ))}
//             </SelectContent>
//         </Select>
//     )
// }
//
// export default LanguageSwitcher


import {cn} from "@/lib/utils";
import {useChangeLocale, useCurrentLocale, useScopedI18n} from "@/locales/client";
import {useRef, useState} from "react";
import {useParams} from "next/navigation";
import {CheckCircle, ChevronDown, CircleCheck, Globe} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useCloseOnClickedOutside from "@/lib/hooks/useCloseOnClickedOutside";
import UIText from "@/components/theme/UIText";
import {useAuth} from "@/components/contexts/AuthContext";



const SupportedLangs = [
    {
        locale: "ur",
        country_code: "pk",
        dir: "rtl",
    },
    {
        locale: "en",
        country_code: "gb",
        dir: "ltr",
    },
];

const SwitchLanguage = ({ styles }) => {
    const langSwitcherRef = useRef(null);
    useCloseOnClickedOutside(langSwitcherRef, () => {
        setDropDown(false);
    });
    const locale = useCurrentLocale();
    const ChangeLocale = useChangeLocale();
    const {setLoading} = useAuth()

    const params = useParams();

    const t = useScopedI18n("languageSwitcher");

    const [dropDown, setDropDown] = useState(false);


    const OnChangeLanguage = (switchTo) => {
        if (locale !== switchTo) {
            setLoading(true)
            ChangeLocale(switchTo)
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className={'w-full'}>
                    <div
                        className="text-xs flex items-center gap-2 cursor-pointer rounded-full border p-1"
                        onClick={() => setDropDown(!dropDown)}
                    >
                        <Globe className={'w-3.5 h-3.5'}/>
                        <UIText className={'ltr:text-sm'} weight={'medium'}>{t(params.locale)}</UIText>
                        <ChevronDown className={'w-3.5 h-3.5'}/>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'p-0'}>
                    {SupportedLangs.map((lang) => (

                        <DropdownMenuItem
                            key={lang.locale}
                            onClick={() => OnChangeLanguage(lang.locale)}
                            className={cn("cursor-pointer border-b px-4 py-2 flex items-center justify-between rtl:flex-row-reverse rounded-none last-of-type:border-0", params.locale === lang.locale && 'text-primary')}
                        >
                            <UIText className={'ltr:text-sm'} weight={'medium'}>{t(lang.locale)}</UIText>
                            {params.locale === lang.locale && (
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </span>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>


        </>
    );
};

export default SwitchLanguage;
