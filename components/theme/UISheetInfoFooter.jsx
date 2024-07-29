import {Button} from "@/components/ui/button";
import {Pen, SquarePen, Trash2, XIcon} from "lucide-react";
import UIText from "@/components/theme/UIText";
import {useI18n} from "@/locales/client";

export const UISheetInfoFooter = ({setOpenDelete, setOpenEdit, setOpen, hasDeletePermission, editLabel, deleteLabel}) =>{
    const t = useI18n()
    return(
        <div className={'mt-auto py-14 flex flex-row items-center justify-between px-2'} dir={'ltr'}>
            <div className={"flex flex-row justify-end gap-4"}>

                {hasDeletePermission &&
                    <Button
                        type="button"
                        variant={'outline'}
                        className={'rounded-md flex items-center gap-2'}
                        onClick={() => setOpenDelete(true)}
                    >
                        <Trash2 className={'w-4 h-4 text-destructive'} />
                        <UIText text={deleteLabel || t('labels.delete')} variant={'xs'}/>
                    </Button>
                }

                <Button
                    type="button"
                    variant={'outline'}
                    className={'rounded-md flex items-center gap-2'}
                    onClick={() => setOpenEdit(true)}
                >
                    <Pen className={'w-4 h-4 text-primary'} />
                    <UIText text={editLabel || t('labels.edit')} variant={'xs'}/>
                </Button>
            </div>

            <Button
                type="button"
                variant={'outline'}
                className="w-16 h-16 rounded-full self-center"
                onClick={() => setOpen(false)}
            >
                <XIcon className="text-primary w-12 h-12" />
            </Button>
        </div>
    )
}