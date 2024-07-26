import {Button} from "@/components/ui/button";
import {Pen, Trash2, XIcon} from "lucide-react";

export const UISheetInfoFooter = ({setOpenDelete, setOpenEdit, setOpen, hasDeletePermission}) =>{
    return(
        <div className={'mt-auto py-14 lg:py-0 flex flex-row items-center justify-between px-2'} dir={'ltr'}>
            <div className={"flex flex-row justify-end gap-4"}>

                {hasDeletePermission &&
                    <Button
                        type="button"
                        className={'group bg-accent hover:bg-accent-foreground dark:bg-accent-foreground dark:hover:bg-accent w-14 h-14 p-2 rounded-full'}
                        onClick={() => setOpenDelete(true)}
                    >
                        <Trash2 className="h-6 w-6 text-destructive" />
                    </Button>
                }

                <Button
                    type="button"
                    className={'group bg-accent hover:bg-accent-foreground dark:bg-accent-foreground dark:hover:bg-accent w-14 h-14 p-2 rounded-full'}
                    onClick={() => setOpenEdit(true)}
                >
                    <Pen className="h-6 w-6 group-hover:text-accent dark:group-hover:text-accent-foreground text-accent-foreground dark:text-accent" />
                </Button>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-16 h-16 rounded-full self-center bg-accent hover:bg-accent-foreground dark:bg-accent-foreground dark:text-accent dark:hover:bg-accent"
                onClick={() => setOpen(false)}
            >
                <XIcon className="text-primary w-12 h-12" />
            </Button>
        </div>
    )
}