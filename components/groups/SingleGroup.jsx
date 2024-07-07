import Text from "@/components/theme/Text";
import { Button } from "@/components/ui/button";
import {Info, Loader2Icon, Pen, Plus, Trash2, Users2, X, XIcon} from "lucide-react";
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
import {AddMemberInput} from "@/components/groups/AddMemberInput";
import {EditGroup} from "@/components/groups/EditGroup";
import {DeleteGroup} from "@/components/groups/DeleteGroup";

const SingleGroup = ({ data, setGroups, setRefresh }) => {
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" })
    const [open, setOpen] = useState(false)
    const [userInGroup, setUserInGroup] = useState([])
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [groupName, setGroupName] = useState(data.name)
    const [refetchMembers, setRefetchMembers] = useState(false)

    useEffect(() => {
        const getUsers = async () => {
            if(data?.$id){
                try {
                    const getMemberships = await teams.listMemberships(data.$id);
                    if(getMemberships){
                        // setUserInGroup(getMemberships.memberships.filter((item)=> item.userEmail !== user.email))
                        setUserInGroup(getMemberships.memberships)
                    }
                } catch (error) {
                    // console.log(error);
                }
            }
        };

        return ()=> getUsers()
    }, [refetchMembers]);


    // fixes dialog adding pointer-events:none to body
    // document.body.style.pointerEvents = "auto";
    useEffect(() => {
        return ()=> FixDrawerPointerEventsIssue(open)
    }, [open]);

    const onDeleteGroup = async() =>{
        const groupID = data.$id;
        await teams.delete(groupID);
        setRefresh(prev=> !prev)
        setOpenDelete(false);
        setOpen(false);
        toast.success("Deleted!", ToastOptions);
    }

    return (

        <Sheet open={open} onOpenChange={setOpen} defaultOpen={false}>
            <SheetTrigger className={'text-left py-3 flex gap-4 justify-between hover:bg-white/70 transition-all duration-300 px-5'}>
                <span>{data.name}</span>
                <span className={'flex items-center gap-1'}>
                    <span>{userInGroup.length > 0 ? userInGroup.length-1 : 0}</span>
                    <span className={'text-xs'}>members</span>
                </span>
            </SheetTrigger>
            <SheetContent
                className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
                side={isDesktop ? "right" : "bottom"}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
                <div className="flex flex-col w-full min-h-full pt-4 justify-start">

                    <div className="flex flex-col gap-10 w-full">
                        <Text
                            variant={"h1"}
                            className="text-left flex items-center flex-wrap gap-2 border-b pb-4"
                        >
                            <span className={'text-primary'}>{groupName}</span>
                        </Text>

                        {/* Users in Group */}
                        <div className={'flex flex-col gap-4'}>
                            <Text className={'font-medium flex items-center gap-2 text-primary'}>
                                <Users2 className={'w-5 h-5'}/>
                                Members in Group
                            </Text>

                            <div className={'flex flex-col divide-y bg-muted rounded'}>
                                {userInGroup.length===0 &&
                                    <div className={'relative overflow-hidden flex items-center justify-between px-4 py-3'}>
                                        No Members in Group.
                                    </div>
                                }
                                {userInGroup?.map((user)=>(
                                    <MemberListItem data={user} key={user.$id} teamID={data.$id} setRefetchMembers={setRefetchMembers}/>
                                ))}
                            </div>
                        </div>

                        <div className={'flex flex-col gap-4'}>
                            <Text className={'font-medium flex items-center gap-2 text-primary'}>
                                <Plus className={'w-5 h-5'}/>
                                Add Members
                            </Text>
                            <AddMemberInput groupID={data.$id} setRefetchMembers={setRefetchMembers}/>
                        </div>
                    </div>


                    <div className={'mt-20 mb-10 flex flex-row items-center justify-between px-2'}>
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

        </Sheet>
    );
};

export default SingleGroup;
