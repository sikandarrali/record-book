import {XIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

export const ClearFieldButton = ({onClick}) =>{
    return(
        <Button
            variant={'outline'}
            type={'button'}
            size={'icon'}
            onClick={onClick}
            className={'!w-10 !h-10 px-2 flex items-center justify-center text-destructive stroke-[2.5]'}
        >
            <XIcon className={'w-4 h-4'} />
        </Button>
    )
}