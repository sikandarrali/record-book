"use client";
import { AddEvent } from "@/components/event/AddEvent";
import PageContainer from "@/components/providers/PageContainer";
import Text from "@/components/theme/Text";
import { FixStickyHeaderScrollError } from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {listUserGroups, teams} from "@/components/appwrite/appwrite";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Info, Trash, Trash2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {DeleteGroupMember} from "@/components/groups/DeleteGroupMember";
import {useAuth} from "@/components/contexts/AuthContext";
import {ID} from "appwrite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {AddGroup} from "@/components/groups/AddGroup";
import SingleGroup from "@/components/groups/SingleGroup";


export default function Home() {

    const {user} = useAuth()
    const [refresh, setRefresh] = useState(false)
    const [openAddGroup, setOpenAddGroup] = useState(false)
    const [groups, setGroups] = useState([])

    useEffect(() => {
        const unsub = async() =>{
            const groupsList = await listUserGroups()
            if(groupsList){
                setGroups(groupsList.teams)
            }
        }
        return ()=> unsub()
    }, [refresh]);

    return (
        <PageContainer hideTopbar>
            <Text variant="h2">Groups</Text>
            <Text>Groups are a way of sharing your Events Data with others. When a new user is added they will receive an invitation email to join the group.</Text>
            <Text className={'flex items-start gap-2 mt-4 text-sm font-medium'}><Info className={'w-5 h-5 text-primary'}/> Added user will be able to Add, Update, Delete and View Events and Data</Text>

            <Tabs defaultValue="ownedGroups" className="w-full mt-4">
                <TabsList className={'w-full h-12'}>
                    <TabsTrigger className={'flex-1 flex h-full'} value="ownedGroups">Your Groups</TabsTrigger>
                    <TabsTrigger className={'flex-1 flex h-full'} value="joinedGroups">Joined Groups</TabsTrigger>
                </TabsList>

                {/* Owned Groups */}
                <TabsContent value="ownedGroups" className={'bg-muted py-6 rounded-b-lg -mt-2'}>
                    <div className={'flex flex-col divide-y'}>
                        <div/>
                        {groups?.filter((group)=> group.prefs.creatorEmail === user.email).map((data)=>(
                            <SingleGroup data={data} key={data.$id} setGroups={setGroups} setRefresh={setRefresh}/>
                        ))}
                        <div/>
                    </div>

                    <div className={'px-5'}>
                        <Button stretched size={'lg'} className={'!mt-10'} onClick={()=> setOpenAddGroup(true)}>Create new Group</Button>
                    </div>
                </TabsContent>

                {/* Joined Groups */}
                <TabsContent value="joinedGroups" className={'bg-muted py-6 rounded-b-lg -mt-2'}>
                    <div className={'flex flex-col divide-y'}>
                        <div/>
                        {groups?.filter((group)=> group.prefs.creatorEmail !== user.email).map((data)=>(
                            <SingleGroup data={data} key={data.$id} setGroups={setGroups} setRefresh={setRefresh}/>
                        ))}
                        <div/>
                    </div>
                </TabsContent>
            </Tabs>

            <AddGroup open={openAddGroup} onOpenChange={setOpenAddGroup} setRefresh={setRefresh}/>
        </PageContainer>
    );
}
