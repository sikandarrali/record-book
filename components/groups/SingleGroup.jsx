import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {CalendarRange, MoveLeft, MoveRight, Pen, Plus, ShieldCheck, Trash2, Users2, X, XIcon} from "lucide-react";
import {useEffect, useLayoutEffect, useState} from "react";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {teams} from "@/components/appwrite/appwrite";
import {MemberListItem} from "@/components/groups/MemberListItem";
import {AddGroupMember} from "@/components/groups/AddGroupMember";
import {EditGroup} from "@/components/groups/EditGroup";
import {DeleteGroup} from "@/components/groups/DeleteGroup";
import {useAuth} from "@/components/contexts/AuthContext";
import {ExitIcon} from "@radix-ui/react-icons";
import {LeaveGroup} from "@/components/groups/LeaveGroup";
import {useScopedI18n} from "@/locales/client";
import {UISheetInfoFooter} from "@/components/theme/UISheetInfoFooter";
import {useData} from "@/components/contexts/DataContext";
import Loader from "@/components/loaders/loader";
import {db} from "@/components/appwrite/database";
import {Permission, Query, Role} from "appwrite";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {UISheet} from "@/components/theme/UISheet";

const SingleGroup = ({ data }) => {
    const [open, setOpen] = useState(false)
    const [usersInGroup, setUsersInGroup] = useState([])
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const {user} = useAuth()
    const [openLeaveGroup, setOpenLeaveGroup] = useState(false)
    const t = useScopedI18n('groups')
    const {setUserGroups} = useData()
    const isOwner = data?.prefs?.creatorEmail === user.email;
    const [localLoading, setLocalLoading] = useState(true)
    const [eventInThisGroup, setEventInThisGroup] = useState([])
    const router = useRouter()


    useEffect(() => {
        const getUsersInGroup = async () => {
            if(open){
                const result = await teams.listMemberships(data.$id);
                setUsersInGroup(result.memberships)
                setLocalLoading(false)
            }
        }
        getUsersInGroup()
    }, [open]);

    const onDeleteGroup = async() =>{
        const groupID = data.$id;

        await UpdateAllEventsOnGroupDelete(groupID)

        await teams.delete(groupID);
        setUserGroups(prev=> prev.filter((item)=> item.$id !== groupID))
        setOpenDelete(false);
        setOpen(false);
        toast.success(t('alertGroupDeleted'), ToastOptions);
    }

    const UpdateAllEventsOnGroupDelete = async (groupID) => {

        let userPermissions = [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
        ]

        for (const item of eventInThisGroup) {

            const eventDataValues = {
                name: item.name,
                date: item.date,
                venue: item.venue,
                details: item.details,
                teamId: item.teamId,
                createdBy: item.createdBy,
                updatedBy: item.updatedBy
            };
            await db.pages.update({...eventDataValues, teamId: null}, item.$id, userPermissions);
        }
    };

    const onLeaveGroup = async(groupID) =>{

        let tempMembershipID = usersInGroup.find((u) => u.userEmail === user.email);

        await teams.deleteMembership(data.$id, tempMembershipID.$id);
        setUserGroups(prev=> prev.filter((item)=> item.$id !== groupID))
        setOpen(false)
        toast.success(t('alertGroupLeft'), ToastOptions);
        setOpenLeaveGroup(false)
    }

    useLayoutEffect(() => {
        const getEvents = async () =>{
            const result = await db.pages.list([Query.equal('teamId', data.$id)])
            setEventInThisGroup(result.documents)
        }

        getEvents()

    }, [router]);

    return (

        <>
            {/* Trigger */}
            <div onClick={()=> setOpen(true)} className={'relative w-full text-left py-4 flex gap-4 items-center justify-between rounded-lg transition-all duration-300 px-5'}>
                <div className={'flex flex-col gap-1'}>
                    <UIText text={data.name} weight={'semibold'}/>
                    <div className={'flex gap-6 items-center divide-red-500 mt-2'}>
                        <div className={'text-muted-foreground flex gap-2 items-center'}>
                            <UIText weight={'semibold'} text={data.total-1}/>
                            <UIText className={'rtl:-mt-2'} text={t('labelMembers')}/>
                        </div>
                        <div className={'w-1.5 h-1.5 rounded-full bg-muted-foreground'}/>
                        <div className={'text-muted-foreground flex gap-2 items-center'}>
                            <UIText weight={'semibold'} text={eventInThisGroup.length}/>
                            <UIText className={'rtl:-mt-2'} text={t('labelEvents')}/>
                        </div>
                    </div>
                </div>
                {isOwner ? <ShieldCheck className={'w-5 h-5 text-primary'}/> : <Users2 className={'w-5 h-5 text-primary'}/>}
            </div>

            <UISheet open={open} onOpenChange={setOpen} defaultOpen={false} bgColor={'bg-background'}>

                <div className="flex flex-col gap-10 w-full">

                    {/* Name in Sheet */}
                    <UIText variant={"heading"} className={'text-primary'} text={data.name}/>

                    {/* Users in Group */}
                    {localLoading ?
                        <Loader/>
                        :
                        <div className={'flex flex-col gap-4'}>
                            <div className={'flex items-center gap-2 text-primary'}>
                                <Users2 className={'w-5 h-5'}/>
                                <UIText weight={'semibold'} text={t('labelMembersInGroup')}/>
                                <UIText weight={'semibold'} text={`(${data.total-1})`}/>
                            </div>

                            <div className={'flex flex-col divide-y divide-muted-foreground bg-muted rounded-lg'}>
                                {usersInGroup.length-1 === 0 ?
                                    <UIText className={'p-6 text-destructive text-center'} weight={'semibold'} text={t('labelNoMembersInGroup')}/>
                                    :
                                    usersInGroup?.map((person)=>(
                                        <MemberListItem
                                            data={person}
                                            key={person.$id}
                                            teamID={data.$id}
                                            groupName={data.name}
                                            isGroupOwner={isOwner}
                                            setUsersInGroup={setUsersInGroup}
                                        />
                                    ))}
                            </div>
                        </div>
                    }

                    {/* Add Group Member */}
                    {isOwner &&
                        <div className={'flex flex-col gap-4 bg-muted -mx-6 px-6 py-6'}>
                            <div className={'flex items-center gap-2 text-primary'}>
                                <Plus className={'w-5 h-5 rtl:stroke-[2.5] rtl:mt-1'}/>
                                <UIText weight={'semibold'} text={t('labelAddMembers')}/>
                            </div>
                            <AddGroupMember groupID={data.$id} setUsersInGroup={setUsersInGroup} />
                        </div>
                    }

                    {/* Books Shared with Group */}
                    <div className={'flex flex-col bg-muted -mx-6 py-6'}>
                        <div className={'flex items-start gap-4 text-primary px-6'}>
                            <CalendarRange className={'w-5 h-5 rtl:stroke-[2.5] mt-1 rtl:mt-4'}/>
                            <UIText weight={'semibold'} text={t('labelEventsSharedWithThisGroup')}/>
                            <UIText weight={'semibold'} className={"rtl:mt-3"} text={`(${eventInThisGroup.length})`}/>
                        </div>

                        <div className={'flex flex-col divide-y bg-muted rounded-lg mt-6'}>
                            {eventInThisGroup.length === 0 ?
                                <UIText className={'p-4 text-destructive text-center mt-4 px-6'} weight={'semibold'} text={t('labelNoEventsSharedWithThisGroup')}/>
                                :
                                <div className={'flex flex-col divide-y divide-muted-foreground'}>
                                    {eventInThisGroup?.map((event)=>(
                                    <Link key={event.$id} href={`/book/${event.$id}`} className={'py-4 px-6 flex justify-between items-center gap-6 hover:bg-background'}>
                                        <UIText weight={'medium'} text={event.name}/>
                                        <MoveRight className={'rtl:hidden text-primary'}/>
                                        <MoveLeft className={'ltr:hidden text-primary'}/>
                                    </Link>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {/* Delete & Leave Group */}
                {isOwner ?
                    <UISheetInfoFooter
                        setOpen={setOpen}
                        setOpenEdit={setOpenEdit}
                        setOpenDelete={setOpenDelete}
                        hasDeletePermission
                    />
                    :
                    <div className={'mt-auto py-14 lg:py-0 lg:mt-10 flex flex-row items-center justify-between px-2'} dir={'ltr'}>
                        <Button
                            variant={'outline'}
                            className={'flex items-center gap-2 text-primary'}
                            onClick={()=> setOpenLeaveGroup(true)}
                        >
                            <ExitIcon className={'-scale-x-100 w-3.5 h-3.5'}/>
                            <UIText variant={'sm'} text={t('btnLeaveGroup')}/>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-16 h-16 rounded-full self-center"
                            onClick={() => setOpen(false)}
                        >
                            <XIcon className="text-primary w-12 h-12" />
                        </Button>
                    </div>
                }

            </UISheet>

            <EditGroup
                data={data}
                open={openEdit}
                onOpenChange={setOpenEdit}
            />
            <DeleteGroup
                groupName={data.name}
                open={openDelete}
                onOpenChange={setOpenDelete}
                onDelete={onDeleteGroup}
            />
            <LeaveGroup
                group={data}
                open={openLeaveGroup}
                onOpenChange={setOpenLeaveGroup}
                onLeave={onLeaveGroup}
            />

        </>
    );
};

export default SingleGroup;
