import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Minus, Plus} from "lucide-react";

export const RecordTypeToggleGroup = ({value, setFieldValue}) =>{
    return(
        <ToggleGroup
            id="category"
            name="category"
            onValueChange={(selectedCat) =>
                setFieldValue("type", selectedCat)
            }
            type="single"
            variant="outline"
            value={value}
            className="grid grid-flow-row grid-cols-2"
        >
            <ToggleGroupItem value={"expense"} className="data-[state=on]:bg-destructive data-[state=on]:text-white">
                {/*{t('labels.recordTypeOut')}*/}
                <Minus/>
            </ToggleGroupItem>
            <ToggleGroupItem value={"income"} className="data-[state=on]:bg-green-500 data-[state=on]:text-white">
                {/*{t('labels.recordTypeIn')}*/}
                <Plus/>
            </ToggleGroupItem>
        </ToggleGroup>
    )
}