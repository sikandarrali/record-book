"use client";
import { AddEvent } from "@/components/event/AddEvent";
import PageContainer from "@/components/providers/PageContainer";
import Text from "@/components/theme/Text";
import { FixStickyHeaderScrollError } from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {teams} from "@/components/appwrite/appwrite";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Home() {

    const [userEmail, setUserEmail] = useState('sikandar14012@gmail.com')
    const [usersInTeam, setUsersInTeam] = useState([])
    const [userTeam, setUserTeam] = useState(null)

    const getTeams = async () => {

        console.log('hey')
        try {
            const getTeam = await teams.list()
            if(getTeam){
                setUserTeam(getTeam.teams[0])
                const getMemberships = await teams.listMemberships(getTeam.teams[0].$id);
                if(getMemberships){
                    setUsersInTeam(getMemberships.memberships)
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // re-populate events when created, fixes missing $id issue
    useEffect(() => {
        getTeams()

    }, []);


    const onAddToGroup = async () =>{

        // const result = await teams.createMembership(
        //     userTeam.$id, // teamId
        //     userEmail, // email (optional)
        //     [], // roles
        //     'https://shadi.aasaan-apps.store', // url (optional)
        // );

        // const result = await teams.createMembership(
        //     userTeam.$id, // teamId
        //     [], // roles
        //     userEmail, // email (optional)
        //     'https://shadi.aasaan.com'
        // );

        // if(result){
        //     console.log(result)
        // }

        console.log(usersInTeam)

    }

    return (
        <PageContainer hideTopbar>
            <Text variant="h2">Groups</Text>

            <div className={'flex flex-col mt-10 gap-2'}>
                <Input value={userEmail} onChange={(e)=> setUserEmail(e.target.value)} />
                <Button onClick={()=> onAddToGroup()}>Add to Group</Button>
            </div>

            <div className={'flex flex-col mt-10 gap-2'}>
                <p className={'font-semibold'}>Users in Group</p>
                {usersInTeam.map((user)=>(
                    <div className={'bg-muted p-4'} key={user.$id}>{user.userEmail}</div>
                ))}
            </div>

        </PageContainer>
    );
}
