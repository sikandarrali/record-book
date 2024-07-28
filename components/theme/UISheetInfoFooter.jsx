import {Button} from "@/components/ui/button";
import {Pen, Trash2, XIcon} from "lucide-react";

export const UISheetInfoFooter = ({setOpenDelete, setOpenEdit, setOpen, hasDeletePermission}) =>{
    return(
        <div className={'mt-auto py-14 flex flex-row items-center justify-between px-2'} dir={'ltr'}>
            <div className={"flex flex-row justify-end gap-4"}>

                {hasDeletePermission &&
                    <Button
                        type="button"
                        variant={'outline'}
                        className={'group w-14 h-14 p-2 rounded-full'}
                        onClick={() => setOpenDelete(true)}
                    >
                        <Trash2 className="h-6 w-6 text-destructive" />
                    </Button>
                }

                <Button
                    type="button"
                    variant={'outline'}
                    className={'group w-14 h-14 p-2 rounded-full'}
                    onClick={() => setOpenEdit(true)}
                >
                    <Pen className="h-6 w-6" />
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