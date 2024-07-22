import { useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useState} from "react";
import {teams} from "../appwrite/appwrite";
import {useAuth} from "@/components/contexts/AuthContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const {user} = useAuth()
    const [userOwnedGroups, setUserOwnedGroups] = useState([])
    const [userGroups, setUserGroups] = useState([])
    const router = useRouter()
    const [dataRefetch, setDataRefetch] = useState(false)

    // get User groups
    useEffect(() => {
        const getUserGroups = async () =>{
            const tempGroups = await teams.list()
            setUserGroups(tempGroups.teams)

            const tempOwnedGroups = tempGroups.teams.filter((item) => item.prefs.creatorEmail === user.email);
            setUserOwnedGroups(tempOwnedGroups)
        }

       if(user){
           getUserGroups()
       }
    }, [dataRefetch]);


    const values = {
        userOwnedGroups,
        userGroups,
        setUserGroups,
        setDataRefetch
    };

    return (
        <DataContext.Provider value={values}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);


