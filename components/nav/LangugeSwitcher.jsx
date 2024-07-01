import {motion} from 'framer-motion'
import {useLayoutEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {account} from "@/components/appwrite/appwrite";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";

const languagesList = [
    {id: 1, value: 'en', label: 'English'},
    {id: 2, value: 'ur', label: 'Urdu'}
]

const LanguageSwitcher = () =>{

    const [language, setLanguage] = useState(languagesList[0])
    const [preferences, setPreferences] = useState({})

    useLayoutEffect(()=>{
        return ()=> getPrefs()
    },[])

    const getPrefs = async () =>{
        const prefs = await account.getPrefs();
        if(prefs){
            setPreferences(prefs)
        }
    }

    const onLanguageChange = async (selected) =>{
        let prefs = {...preferences, lang: selected}
        setLanguage(selected)
        // await account.updatePrefs(prefs)
        // toast.success("Language Updated", ToastOptions);
        toast.info("Feature Coming Soon", ToastOptions);
    }

    return(
        <Select onValueChange={(selected)=> onLanguageChange(selected)}>
            <SelectTrigger className="w-[100px] bg-muted font-semibold">
                <SelectValue placeholder={language.label} />
            </SelectTrigger>
            <SelectContent>
                {languagesList.map((lang)=>(
                    <SelectItem value={lang.value} key={lang.value}>{lang.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default LanguageSwitcher