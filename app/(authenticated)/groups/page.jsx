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
    const [showInfo, setShowInfo] = useState(false)

    useEffect(() => {
        const unsub = async() =>{
            if(user){
                const groupsList = await teams.list()
                setGroups(groupsList.teams)
            }
        }
        return ()=> unsub()
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

            {/*<Tabs defaultValue="ownedGroups" className="w-full mt-4">*/}
            {/*    <TabsList className={'w-full h-12'}>*/}
            {/*        <TabsTrigger className={'flex-1 flex h-full'} value="ownedGroups">Your Groups</TabsTrigger>*/}
            {/*        <TabsTrigger className={'flex-1 flex h-full'} value="joinedGroups">Joined Groups</TabsTrigger>*/}
            {/*    </TabsList>*/}

            {/*    /!* Owned Groups *!/*/}
            {/*    <TabsContent value="ownedGroups" className={'bg-muted py-6 rounded-b-lg -mt-2'}>*/}
            {/*        <div className={'flex flex-col divide-y'}>*/}
            {/*            <div/>*/}
            {/*            {groups?.filter((group)=> group.prefs.creatorEmail === user.email).map((data)=>(*/}
            {/*                <SingleGroup data={data} key={data.$id} setGroups={setGroups} setRefresh={setRefresh}/>*/}
            {/*            ))}*/}
            {/*            <div/>*/}
            {/*        </div>*/}

            {/*        <div className={'px-5'}>*/}
            {/*            <Button stretched size={'lg'} className={'!mt-10'} onClick={()=> setOpenAddGroup(true)}>Create new Group</Button>*/}
            {/*        </div>*/}
            {/*    </TabsContent>*/}

            {/*    /!* Joined Groups *!/*/}
            {/*    <TabsContent value="joinedGroups" className={'bg-muted py-6 rounded-b-lg -mt-2'}>*/}
            {/*        <div className={'flex flex-col divide-y'}>*/}
            {/*            <div/>*/}
            {/*            {groups?.filter((group)=> group.prefs.creatorEmail !== user.email).map((data)=>(*/}
            {/*                <SingleGroup data={data} key={data.$id} setGroups={setGroups} setRefresh={setRefresh}/>*/}
            {/*            ))}*/}
            {/*            <div/>*/}
            {/*        </div>*/}
            {/*    </TabsContent>*/}
            {/*</Tabs>*/}

            <Text className={'py-2 mt-8 font-semibold text-primary'}>Your Groups</Text>

            <div className={'flex flex-col divide-y bg-muted rounded-lg'}>
                {groups.map((data)=>(
                    <SingleGroup data={data} key={data.$id} setGroups={setGroups} setRefresh={setRefresh}/>
                ))}
            </div>

            <Button stretched size={'lg'} className={'mt-5'} onClick={()=> setOpenAddGroup(true)}>Create new Group</Button>

            <AddGroup open={openAddGroup} onOpenChange={setOpenAddGroup} setRefresh={setRefresh}/>
        </PageContainer>
    );
}
