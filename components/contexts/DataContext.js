// context/AuthContext.js

import { createSessionCookie, deleteSessionCookie } from "@/cookies/UserCookie";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {
    account,
    getCurrentSession,
    getCurrentUser,
    getUserInCollection, ID, listUserGroups, listUserOwnedGroups,
    refreshCurrentSession, teams
} from "../appwrite/appwrite";
import LoadingFallback from "../loaders/LoadingFallback";
import {useMyStore} from "@/store/store";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {error} from "next/dist/build/output/log";
import {HOMEPAGE_ROUTE, LOGIN_ROUTE, PROTECTED_ROUTES} from "@/lib/routes";
import {useAuth} from "@/components/contexts/AuthContext";

const DataContext = createContext();

// @TODO: Login > Show Loader > set user, cookie > hide loader > show content

export const DataProvider = ({ children }) => {
    const {user} = useAuth()
    const [userOwnedGroups, setUserOwnedGroups] = useState([])
    const [userGroups, setUserGroups] = useState([])
    const router = useRouter()

    // get User groups
    useEffect(() => {
        const getUserGroups = async () =>{
            if(user){
                const tempGroups = await listUserGroups()
                setUserGroups(tempGroups.teams)

                const tempOwnedGroups = tempGroups.teams.filter((item) => item.prefs.creatorEmail === user.email);
                setUserOwnedGroups(tempOwnedGroups)
            }else{
                setUserOwnedGroups([])
                setUserGroups([])
            }
        }

        getUserGroups()
    }, [router]);


    const values = {
        userOwnedGroups,
        userGroups,
        setUserGroups
    };

    return (
        <DataContext.Provider value={values}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);


