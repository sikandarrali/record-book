import {useState} from "react";
import {teams} from "@/components/appwrite/appwrite";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Trash2} from "lucide-react";
import {DeleteGroupMember} from "@/components/groups/DeleteGroupMember";
import {useAuth} from "@/components/contexts/AuthContext";
import {Badge} from "@/components/ui/badge";

export const MemberListItem = ({data, teamID, setRefetchMembers}) =>{

    const [openDelete, setOpenDelete] = useState(false)
    const {user} = useAuth()

    const onDelete = async() =>{
        const result = await teams.deleteMembership(
            teamID, // teamId
            data.$id // membershipId
        );
        if(result){
            toast.success("User removed from Group", ToastOptions);
            setRefetchMembers(prev=>!prev)
        }
    }

    return(
        <div className={'relative overflow-hidden flex items-center justify-between px-4 py-3'}>
            <span>{data?.userEmail}</span>

            {data.userEmail === user.email ?
                <Badge>You</Badge>
                :
                <>
                    <Trash2
                        onClick={()=> setOpenDelete(true)}
                        className={'w-4 h-4 outline-[3] text-primary cursor-pointer'}
                    />
                    <DeleteGroupMember
                        membershipID={data.$id}
                        open={openDelete}
                        onOpenChange={setOpenDelete}
                        onDelete={onDelete}
                        userEmail={data.userEmail}
                    />
                </>
            }
        </div>
    )
}
