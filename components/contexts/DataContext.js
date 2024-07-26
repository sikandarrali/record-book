import { useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useLayoutEffect, useState} from "react";
import {teams} from "../appwrite/appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {COOKIE_THEME_NAME, DEFAULT_THEME} from "@/lib/defaults";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const {user} = useAuth()
    const [userOwnedGroups, setUserOwnedGroups] = useState([])
    const [userGroups, setUserGroups] = useState([])
    const router = useRouter()
    const [dataRefetch, setDataRefetch] = useState(false)


    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem(COOKIE_THEME_NAME))

    // add theme class to body
    useLayoutEffect(() => {
        document.body.classList.add(currentTheme)
        document.documentElement.classList.add(currentTheme)
    }, [currentTheme]);

    // get User groups
    useEffect(() => {
        if(user){
            const getUserGroups = async () =>{
                const tempGroups = await teams.list()
                setUserGroups(tempGroups.teams)

                const tempOwnedGroups = tempGroups.teams.filter((item) => item.prefs.creatorEmail === user.email);
                setUserOwnedGroups(tempOwnedGroups)
            }
           getUserGroups()
       }
    }, [dataRefetch]);


    const values = {
        userOwnedGroups,
        userGroups,
        setUserGroups,
        setDataRefetch,
        currentTheme,
        setCurrentTheme
    };

    return (
        <DataContext.Provider value={values}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);


