import {useState} from "react";
import {teams} from "@/components/appwrite/appwrite";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Trash2} from "lucide-react";
import {DeleteGroupMember} from "@/components/groups/DeleteGroupMember";
import {useAuth} from "@/components/contexts/AuthContext";
import {Badge} from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Button} from "@/components/ui/button";


export const MemberListItem = ({data, teamID, setUsersInGroup, setRefetchMembers, groupName, isGroupOwner}) =>{

    const isOwner =  data.roles.includes('owner');
    const isMember = !isOwner

    const [openDelete, setOpenDelete] = useState(false)
    const {user} = useAuth()

    const onDelete = async() =>{
        const result = await teams.deleteMembership(
            teamID, // teamId
            data.$id // membershipId
        );
        if(result){
            toast.success("User removed from Group", ToastOptions);
            setUsersInGroup(prev=> prev.filter((item)=> item.$id !== data.$id))
        }
    }

    return(
        <div className={'relative overflow-hidden flex items-center justify-between gap-4 px-4 py-3'}>

            <div className={'flex flex-col items-start w-full gap-2 line-clamp-1'}>
                <span className={'font-medium'}>{data?.userEmail}</span>

                {data.confirm ?
                    <div className={'flex gap-2 items-center text-xs'}>
                        {isOwner  && <Badge variant={'secondary'}>Admin</Badge>}
                        {isMember && <Badge variant={'outline'} className={'text-green-500 border-green-500'}>Member</Badge>}
                        {user.email === data.userEmail && <Badge>You</Badge>}
                    </div>
                    :
                    <Tooltip>
                        <TooltipTrigger><Badge variant={'outline'} className={'text-xs bg-white border-destructive text-destructive'}>pending</Badge></TooltipTrigger>
                        <TooltipContent className={'bg-foreground'}>
                            <p className={'font-semibold'}>User has not accepted invitation.</p>
                        </TooltipContent>
                    </Tooltip>
                }

            </div>

            {isGroupOwner && !isOwner &&
                <Button
                    variant={'ghost'}
                    className={'h-8 border-primary text-primary px-2 hover:text-primary'}
                    onClick={()=> setOpenDelete(true)}
                >
                    <Trash2 className={'w-4 h-4'}/>
                </Button>
            }

            <DeleteGroupMember
                membershipID={data.$id}
                open={openDelete}
                onOpenChange={setOpenDelete}
                onDelete={onDelete}
                userEmail={data.userEmail}
                groupName={groupName}
            />
        </div>
    )
}
