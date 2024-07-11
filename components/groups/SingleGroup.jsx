import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import {Info, Loader2Icon, Pen, Plus, ShieldCheck, Trash2, Users2, X, XIcon} from "lucide-react";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import { NumericFormat } from "react-number-format";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import {useMyStore} from "@/store/store";
import {db} from "@/components/appwrite/database";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {Query} from "appwrite";
import {teams} from "@/components/appwrite/appwrite";
import {MemberListItem} from "@/components/groups/MemberListItem";
import {FixDrawerPointerEventsIssue} from "@/lib/hooks/FixDrawerPointerEventsIssue";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {cn} from "@/lib/utils";
import {Form, Formik} from "formik";
import FormLabel from "@/components/theme/FormLabel";
import {Input} from "@/components/ui/input";
import {useMediaQuery} from "react-responsive";
import * as Yup from "yup";
import {AddGroupMember} from "@/components/groups/AddGroupMember";
import {EditGroup} from "@/components/groups/EditGroup";
import {DeleteGroup} from "@/components/groups/DeleteGroup";
import {useAuth} from "@/components/contexts/AuthContext";
import {ExitIcon} from "@radix-ui/react-icons";
import {LeaveGroup} from "@/components/groups/LeaveGroup";

const SingleGroup = ({ data, setGroups, setRefresh }) => {
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
    const [open, setOpen] = useState(false)
    const [userInGroup, setUserInGroup] = useState([])
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [groupName, setGroupName] = useState(data.name)
    const [refetchMembers, setRefetchMembers] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const {user} = useAuth()
    const [openLeaveGroup, setOpenLeaveGroup] = useState(false)

    useEffect(() => {
        const getGroupMembers = async () => {
            if(user){
                try {
                    const getMemberships = await teams.listMemberships(data.$id);
                    setUserInGroup(getMemberships.memberships)
                    let tempOwner = getMemberships.memberships.some((item)=>(item.userEmail===user.email && item.roles.includes('owner')))
                    setIsOwner(tempOwner)
                } catch (error) {
                    setUserInGroup([])
                    setIsOwner(false)
                }
            }
        };

        return ()=> getGroupMembers()
    }, [refetchMembers]);

    const onDeleteGroup = async() =>{
        const groupID = data.$id;
        await teams.delete(groupID);
        setRefresh(prev=> !prev)
        setOpenDelete(false);
        setOpen(false);
        toast.success("Deleted!", ToastOptions);
    }

    const onLeaveGroup = async(membershipID) =>{

        let tempMembershipID = userInGroup.find((u) => u.userEmail === user.email);

        const result = await teams.deleteMembership(
            data.$id, // teamId
            tempMembershipID.$id // membershipId
        );
        if(result){
            setRefresh(prev=>!prev)
            setOpen(false)
            toast.success("You just left the Group.", ToastOptions);
            setOpenLeaveGroup(false)
        }
    }

    return (

        <Sheet open={open} onOpenChange={setOpen} defaultOpen={false}>
            <SheetTrigger className={'relative text-left py-5 flex gap-4 justify-between hover:bg-white/70 transition-all duration-300 px-5'}>
                <span>{data.name}</span>
                {isOwner ? <ShieldCheck className={'w-5 h-5'}/> : <Users2 className={'w-5 h-5'}/>}
            </SheetTrigger>
            <SheetContent
                className={cn("pb-8 lg:pb-14 overflow-auto max-h-[85vh] bg-muted")}
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
                            <span className={'text-primary'}>{groupName}</span>
                        </Text>

                        {/* Users in Group */}
                        <div className={'flex flex-col gap-4'}>
                            <Text className={'font-semibold flex items-center gap-2 text-primary'}>
                                <Users2 className={'w-5 h-5'}/>
                                Members in Group
                            </Text>

                            <div className={'flex flex-col divide-y bg-background rounded-lg'}>
                                {userInGroup.length===0 &&
                                    <div className={'relative overflow-hidden flex items-center justify-between px-4 py-3'}>
                                        No Members in Group.
                                    </div>
                                }
                                {userInGroup?.map((person)=>(
                                    <MemberListItem
                                        data={person}
                                        key={person.$id}
                                        teamID={data.$id}
                                        setRefetchMembers={setRefetchMembers}
                                        groupName={data.name}
                                        isGroupOwner={isOwner}
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
                                <AddGroupMember groupID={data.$id} setRefetchMembers={setRefetchMembers}/>
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
                setGroupName={setGroupName}
                setRefresh={setRefresh}
            />
            <DeleteGroup
                groupName={groupName}
                open={openDelete}
                onOpenChange={setOpenDelete}
                onDelete={onDeleteGroup}
            />
            <LeaveGroup
                groupName={groupName}
                open={openLeaveGroup}
                onOpenChange={setOpenLeaveGroup}
                onLeave={onLeaveGroup}
            />

        </Sheet>
    );
};

export default SingleGroup;
