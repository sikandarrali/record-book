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

    const params = useParams();

    const t = useScopedI18n("languageSwitcher");

    const [dropDown, setDropDown] = useState(false);

    const OnChangeLanguage = (switchTo) => {
        if (locale === switchTo) return;
        else ChangeLocale(switchTo);
    };

    return (
        <div
            className={cn(
                "p-1 border flex relative rounded-full select-none rtl:font-urdu hover:bg-muted",
                dropDown && "bg-muted"
            )}
            ref={langSwitcherRef}
        >
            <div
                className="text-xs flex items-center gap-1 cursor-pointer rounded-full"
                onClick={() => setDropDown(!dropDown)}
            >
               <Globe className={'w-3.5 h-3.5'}/>
                <div>{t(params.locale)}</div>
                <ChevronDown className={'w-3.5 h-3.5'}/>
            </div>
            {dropDown && (
                <div className={"border bg-muted overflow-hidden shadow-lg rounded-lg mt-1 flex flex-col absolute z-[51] top-full left-full -translate-x-full text-sm rtl:font-semibold"}>
                    {SupportedLangs.map((lang) => (
                        <div
                            key={lang.locale}
                            onClick={() => OnChangeLanguage(lang.locale)}
                            className={cn(
                                "flex items-center justify-between gap-4 px-4 rtl:pr-5 py-2 border-b cursor-pointer rtl:flex-row-reverse hover:bg-primary-foreground",
                                params.locale === lang.locale && 'text-primary'
                            )}
                        >
                            <span>{t(lang.locale)}</span>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SwitchLanguage;
