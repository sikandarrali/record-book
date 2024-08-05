import {useState} from "react";
import {
    COLLECTION_ID_BOOKS_RECORDS,
    DATABASE_ID,
    databases,
    PARENT_BOOK_ID_FIELD_NAME,
    teams
} from "@/components/appwrite/appwrite";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Trash2} from "lucide-react";
import {DeleteGroupMember} from "@/components/groups/DeleteGroupMember";
import {useAuth} from "@/components/contexts/AuthContext";
import {Badge} from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Button} from "@/components/ui/button";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import {db} from "@/components/appwrite/database";
import {Permission, Query, Role} from "appwrite";

export const MemberListItem = ({data, eventInThisGroup, teamID, setUsersInGroup, groupName, isGroupOwner}) =>{

    const isOwner =  data.roles.includes('owner');
    const isMember = !isOwner
    const t = useScopedI18n('groups')

    const [openDelete, setOpenDelete] = useState(false)
    const {user} = useAuth()

    const onDelete = async() =>{
        const result = await teams.deleteMembership(
            teamID, // teamId
            data.$id // membershipId
        );
        if(result){
            updateRecordsPermissions()
            toast.success(t('alertGroupMemberRemoved'), ToastOptions);
            setUsersInGroup(prev=> prev.filter((item)=> item.$id !== data.$id))
        }
    }

    const updateRecordsPermissions =  async () =>{

        const eventIDs = eventInThisGroup.reduce((acc, item) => {
            acc.push(item.$id);
            return acc;
        }, []);

        const getItemsForIDs = async (IDs) => {
            const allItems = [];

            for (const id of IDs) {
                try {
                    const items = await db.records.list([
                        Query.equal(PARENT_BOOK_ID_FIELD_NAME, id),
                    ]);

                    const docs = items.documents

                    allItems.push([...docs]);
                } catch (error) {
                    // console.error(`Error fetching items for ID ${id}:`, error);
                }
            }

            return allItems.flat();
        };

        try {
            const items = await getItemsForIDs(eventIDs);

            for (const item of items) {

                await databases.updateDocument(DATABASE_ID, COLLECTION_ID_BOOKS_RECORDS, item.$id, {}, [
                    Permission.read(Role.team(teamID, "member")),
                    Permission.update(Role.team(teamID, "member")),
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ])
            }
            // Proceed with updating records permissions using the fetched items
        } catch (error) {
            console.error('Error updating records permissions:', error);
        }


    }

    return(
        <div className={'relative overflow-hidden flex items-center justify-between gap-4 px-4 py-5'}>

            <div className={'flex flex-col items-start w-full gap-4 line-clamp-1'}>
                <span className={'font-medium select-auto'}>{data?.userEmail}</span>
                {data.confirm ?
                    <div className={'flex gap-2 items-stretch text-xs'}>
                        {isOwner  && <Badge>{t('badgeAdmin')}</Badge>}
                        {isMember && <Badge variant={'outline'} className={'border-muted-foreground'}>{t('badgeMember')}</Badge>}
                        {user.email === data.userEmail && <Badge variant={'outline'} className={'text-green-500 border-green-500'}>{t('badgeYou')}</Badge>}
                    </div>
                    :
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant={'outline'} className={'text-xs bg-white border-destructive text-destructive'}>
                                <UIText variant={'xs'} className={'rtl:-mt-1'} text={t('badgePending')}/>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent className={'bg-foreground'}>
                            <UIText variant={'sm'} text={t('tooltipPendingUser')}/>
                        </TooltipContent>
                    </Tooltip>
                }

            </div>

            {isGroupOwner && !isOwner &&
                <Button
                    variant={'destructive'}
                    className={'h-8'}
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
