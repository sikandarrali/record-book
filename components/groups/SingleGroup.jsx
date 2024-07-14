import Text from "@/components/theme/Text";
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

const SingleGroup = ({ data, userGroups, setUserGroups }) => {
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
    const [open, setOpen] = useState(false)
    const [usersInGroup, setUsersInGroup] = useState([])
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const {user} = useAuth()
    const [openLeaveGroup, setOpenLeaveGroup] = useState(false)

    const isOwner = data?.prefs?.creatorEmail === user.email;

    useEffect(() => {
        const getUsersInGroup = async () => {
            if(open){
                const result = await teams.listMemberships(data.$id);
                setUsersInGroup(result.memberships)
            }
        }
        getUsersInGroup()
    }, [open]);

    const onDeleteGroup = async() =>{
        const groupID = data.$id;
        await teams.delete(groupID);
        setUserGroups(prev=> prev.filter((item)=> item.$id !== groupID))
        setOpenDelete(false);
        setOpen(false);
        toast.success("Deleted!", ToastOptions);
    }

    const onLeaveGroup = async(groupID) =>{

        let tempMembershipID = usersInGroup.find((u) => u.userEmail === user.email);

        await teams.deleteMembership(data.$id, tempMembershipID.$id);
        setUserGroups(prev=> prev.filter((item)=> item.$id !== groupID))
        setOpen(false)
        toast.success("You just left the Group.", ToastOptions);
        setOpenLeaveGroup(false)
    }

    return (

        <Sheet open={open} onOpenChange={setOpen} defaultOpen={false}>
            <SheetTrigger className={'relative w-full text-left py-4 flex gap-4 items-center justify-between hover:bg-white/70 transition-all duration-300 px-5'}>
                <span className={'flex flex-col gap-1'}>
                    <span className={'font-medium'}>{data.name}</span>
                    <span className={'text-muted-foreground text-sm'}>{data.total-1} members</span>
                </span>
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
                        <Text
                            variant={"h1"}
                            className="text-left flex items-center flex-wrap gap-2 border-b pb-4 justify-between"
                        >
                            <span className={'text-primary'}>{data.name}</span>
                        </Text>

                        {/* Users in Group */}
                        <div className={'flex flex-col gap-4'}>
                            <Text className={'font-semibold flex items-center gap-2 text-primary'}>
                                <Users2 className={'w-5 h-5'}/>
                                Members in Group
                            </Text>

                            <div className={'flex flex-col divide-y bg-background rounded-lg'}>
                                {usersInGroup.length===0 &&
                                    <div className={'relative overflow-hidden flex items-center justify-between px-4 py-3'}>
                                        No Members in Group.
                                    </div>
                                }
                                {usersInGroup?.map((person)=>(
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

                        {isOwner &&
                            <div className={'flex flex-col gap-4 bg-background -mx-6 px-6 py-6'}>
                                <Text className={'font-semibold flex items-center gap-2 text-primary'}>
                                    <Plus className={'w-5 h-5'}/>
                                    Add Members
                                </Text>
                                <AddGroupMember groupID={data.$id} setUsersInGroup={setUsersInGroup} />
                            </div>
                        }
                    </div>


                    <div className={'mt-auto py-14 lg:py-0 flex flex-row items-center justify-between px-2'}>

                        {!isOwner ?
                            <Button
                                size={'sm'}
                                variant={'outline'}
                                className={'flex items-center gap-2 text-primary'}
                                onClick={()=> setOpenLeaveGroup(true)}
                            >
                                <ExitIcon className={'-scale-x-100 w-3.5 h-3.5'}/>
                                <span>Leave Group</span>
                            </Button>
                        :
                            <div className={"flex flex-row justify-end gap-4"}>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setOpenDelete(true)}
                                >
                                    <Trash2 className="h-5 w-5 text-primary" />
                                </Button>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setOpenEdit(true)}
                                >
                                    <Pen className="h-4 w-4" />
                                </Button>
                            </div>
                        }

                        <Button
                            type="submit"
                            variant="outline"
                            size="icon"
                            // stretched
                            className="w-14 h-14 rounded-full self-center"
                            onClick={() => setOpen(false)}
                        >
                            <XIcon className="text-primary" />
                        </Button>
                    </div>
                </div>
            </SheetContent>

            <EditGroup
                data={data}
                open={openEdit}
                onOpenChange={setOpenEdit}
                userGroups={userGroups}
                setUserGroups={setUserGroups}
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
