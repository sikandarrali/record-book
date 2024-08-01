import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {useI18n} from "@/locales/client";
import {Check} from "lucide-react";
import {CheckIcon} from "@radix-ui/react-icons";

export const BookTypeToggleGroup = ({value, setFieldValue}) =>{
    const t = useI18n()
    return(
        <ToggleGroup
            id="bookType"
            name="bookType"
            onValueChange={(selectedCat) =>
                setFieldValue("type", selectedCat)
            }
            type="single"
            variant="outline"
            value={value}
            className="grid grid-flow-row grid-cols-2 gap-4"
        >
            <ToggleGroupItem value={"khaataBook"} className="data-[state=on]:bg-muted group">
                <CheckIcon className="w-4 h-4 group-data-[state=on]:flex group-data-[state=off]:hidden mr-2" />
                {t('labels.khaataBook')}
            </ToggleGroupItem>
            <ToggleGroupItem value={"recordBook"} className="data-[state=on]:bg-muted group">
                <CheckIcon className="w-4 h-4 group-data-[state=on]:flex group-data-[state=off]:hidden mr-2" />
                {t('labels.recordBook')}
            </ToggleGroupItem>
        </ToggleGroup>
    )
}