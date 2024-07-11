import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "@/components/ui/alert-dialog";

export const UIDialogFooter = ({onDelete, onOpenChange, yesLabel}) =>{
    return(
        <AlertDialogFooter className={'!flex-row items-center !justify-between gap-4'}>
            <AlertDialogCancel className={'mt-0'} onClick={() => onDelete()}>
                {yesLabel ? yesLabel : "Yes, Delete"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
                Cancel
            </AlertDialogAction>
        </AlertDialogFooter>
    )
}