"use client";
import { AddEvent } from "@/components/event/AddEvent";
import PageContainer from "@/components/providers/PageContainer";
import Text from "@/components/theme/Text";
import { FixStickyHeaderScrollError } from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { motion } from "framer-motion";
import {Suspense, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Info, Trash, Trash2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {DeleteGroupMember} from "@/components/groups/DeleteGroupMember";
import {useAuth} from "@/components/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {AddGroup} from "@/components/groups/AddGroup";
import SingleGroup from "@/components/groups/SingleGroup";
import Loader from "@/components/loaders/loader";
import {Teams, Client} from "appwrite";
import {listUserGroups, teams} from "@/components/appwrite/appwrite";
import ItemsSkeleton from "@/components/loaders/ItemsSkeleton";
import GroupSkeleton from "@/components/loaders/GroupSkeleton";
import {useData} from "@/components/contexts/DataContext";


export default function Page() {

    const {user} = useAuth()
    const [openAddGroup, setOpenAddGroup] = useState(false)
    const [groups, setGroups] = useState([])
    const [showSkeleton, setShowSkeleton] = useState(true)
    // const {userGroups, setUserGroups} = useData()
    const [userGroups, setUserGroups] = useState([])
    const [refresh, setRefresh] = useState([])

    const getUserGroups = async () =>{
        if(user){
            const tempGroups = await listUserGroups()
            setUserGroups(tempGroups.teams)
        }else{
            setUserGroups([])
        }
    }
    useEffect(() => {
        return ()=> getUserGroups()
    }, [refresh]);

    return (
        <PageContainer hideTopbar>
            <Text variant="h2">Groups</Text>
            <Text className={'text-base'}>Groups are a way of sharing your Events Data with others. When a new user is added they will receive an invitation email to join the group.</Text>

            <Text className={'flex items-center gap-2 mt-4 font-medium text-primary'} variant={'sm'}>
                <Info className={'w-4 h-4'}/> Important Information
            </Text>
            <ul className={'list-disc pl-12'}>
                <li><Text variant={'sm'}>Added user will be able to <span className={'font-semibold'}>Add</span>, <span className={'font-semibold'}>Update</span>, <span className={'font-semibold'}>Delete</span> and <span className={'font-semibold'}>View</span> Events and all its Data</Text></li>
                <li><Text variant={'sm'}>User need to accept invitation sent to them via email before they can manage shared data</Text></li>
            </ul>

            <Text className={'py-2 mt-8 font-semibold text-primary'}>Your Groups</Text>

            <div className={'flex flex-col bg-muted rounded-lg relative shadow'}>

                {userGroups.map((data)=>(
                    <SingleGroup data={data} key={data.$id} userGroups={userGroups} setUserGroups={setUserGroups} />
                ))}

            </div>

            <Button stretched size={'lg'} className={'mt-5'} onClick={()=> setOpenAddGroup(true)}>Create new Group</Button>

            <AddGroup open={openAddGroup} setRefresh={setRefresh} onOpenChange={setOpenAddGroup} setUserGroups={setUserGroups}/>
        </PageContainer>
    );
}
