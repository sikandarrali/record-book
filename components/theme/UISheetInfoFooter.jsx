import {Button} from "@/components/ui/button";
import {Pen, Trash2, XIcon} from "lucide-react";

export const UISheetInfoFooter = ({setOpenDelete, setOpenEdit, setOpenDetails}) =>{
    return(
        <div className={'mt-auto py-14 lg:py-0 flex flex-row items-center justify-between px-2'} dir={'ltr'}>
            <div className={"flex flex-row justify-end gap-4"}>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setOpenDelete(true)}
                >
                    <Trash2 className="h-5 w-5 text-primary" />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setOpenEdit(true)}
                >
                    <Pen className="h-4 w-4" />
                </Button>
            </div>

            <Button
                type="button"
                variant="outline"
                size="icon"
                // stretched
                className="w-14 h-14 rounded-full self-center"
                onClick={() => setOpenDetails(false)}
            >
                <XIcon className="text-primary" />
            </Button>
        </div>
    )
}