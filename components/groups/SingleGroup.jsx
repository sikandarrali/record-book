import UIText from "@/components/theme/UIText";
import { Button } from "@/components/ui/button";
import {Pen, Plus, ShieldCheck, Trash2, Users2, X, XIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {teams} from "@/components/appwrite/appwrite";
import {MemberListItem} from "@/components/groups/MemberListItem";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {cn} from "@/lib/utils";
import {useMediaQuery} from "react-responsive";
import {AddGroupMember} from "@/components/groups/AddGroupMember";
import {EditGroup} from "@/components/groups/EditGroup";
import {DeleteGroup} from "@/components/groups/DeleteGroup";
import {useAuth} from "@/components/contexts/AuthContext";
import {ExitIcon} from "@radix-ui/react-icons";
import {LeaveGroup} from "@/components/groups/LeaveGroup";
import {useScopedI18n} from "@/locales/client";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {UISheetInfoFooter} from "@/components/theme/UISheetInfoFooter";
import {useData} from "@/components/contexts/DataContext";
import Loader from "@/components/loaders/loader";

const SingleGroup = ({ data }) => {
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
    const [open, setOpen] = useState(false)
    const [usersInGroup, setUsersInGroup] = useState([])
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const {user} = useAuth()
    const [openLeaveGroup, setOpenLeaveGroup] = useState(false)
    const t = useScopedI18n('groups')
    const {userGroups, setUserGroups} = useData()
    const isOwner = data?.prefs?.creatorEmail === user.email;
    const [localLoading, setLocalLoading] = useState(true)


    useEffect(() => {
        const getUsersInGroup = async () => {
            if(open){
                const result = await teams.listMemberships(data.$id);
                setUsersInGroup(result.memberships)
            }
            setLocalLoading(false)
        }
        getUsersInGroup()
    }, [open]);

    const onDeleteGroup = async() =>{
        const groupID = data.$id;
        await teams.delete(groupID);
        setUserGroups(prev=> prev.filter((item)=> item.$id !== groupID))
        setOpenDelete(false);
        setOpen(false);
        toast.success(t('alertGroupDeleted'), ToastOptions);
    }

    const onLeaveGroup = async(groupID) =>{

        let tempMembershipID = usersInGroup.find((u) => u.userEmail === user.email);

        await teams.deleteMembership(data.$id, tempMembershipID.$id);
        setUserGroups(prev=> prev.filter((item)=> item.$id !== groupID))
        setOpen(false)
        toast.success(t('alertGroupLeft'), ToastOptions);
        setOpenLeaveGroup(false)
    }

    return (

        <Sheet open={open} onOpenChange={setOpen} defaultOpen={false}>
            <SheetTrigger className={'outline-none relative w-full text-left py-4 flex gap-4 items-center justify-between hover:bg-white/70 transition-all duration-300 px-5'}>
                <div className={'flex flex-col gap-1'}>
                    <UIText text={data.name} weight={'semibold'}/>
                    <div className={'text-muted-foreground flex gap-2 items-center'}>
                        <UIText text={data.total-1}/>
                        <UIText className={'rtl:-mt-2'} text={t('labelMembers')}/>
                    </div>
                </div>
                {isOwner ? <ShieldCheck className={'w-5 h-5 text-primary'}/> : <Users2 className={'w-5 h-5 text-primary'}/>}
            </SheetTrigger>
            <SheetContent
                className={cn("pb-8 lg:pb-14 overflow-auto max-h-[85vh] lg:max-h-screen bg-muted")}
                side={isDesktop ? "right" : "bottom"}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
                <div className="flex flex-col w-full min-h-full pt-4 justify-start">

                    <div className="flex flex-col gap-10 w-full">
                        <UIText variant={"heading"} className={'text-primary'} text={data.name}/>

                        {/* Users in Group */}
                        {localLoading ?
                            <Loader/>
                            :
                            <div className={'flex flex-col gap-4'}>
                                <div className={'flex items-center gap-2 text-primary'}>
                                    <Users2 className={'w-5 h-5'}/>
                                    <UIText weight={'semibold'} text={t('labelMembersInGroup')}/>
                                </div>

                                <div className={'flex flex-col divide-y bg-background rounded-lg'}>
                                    {usersInGroup.length-1 === 0 ?
                                        <UIText className={'p-4'} text={t('labelNoMembersInGroup')}/>
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

                        {isOwner &&
                            <div className={'flex flex-col gap-4 bg-background -mx-6 px-6 py-6'}>
                                <div className={'flex items-center gap-2 text-primary'}>
                                    <Plus className={'w-5 h-5 rtl:stroke-[2.5] rtl:mt-1'}/>
                                    <UIText weight={'semibold'} text={t('labelAddMembers')}/>
                                </div>
                                <AddGroupMember groupID={data.$id} setUsersInGroup={setUsersInGroup} />
                            </div>
                        }
                    </div>


                    {isOwner ?
                        <UISheetInfoFooter
                            setOpen={setOpen}
                            setOpenEdit={setOpenEdit}
                            setOpenDelete={setOpenDelete}
                            hasDeletePermission
                        />
                        :
                        <div className={'mt-auto py-14 lg:py-0 flex flex-row items-center justify-between px-2'} dir={'ltr'}>
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


                </div>
            </SheetContent>

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

        </Sheet>
    );
};

export default SingleGroup;
