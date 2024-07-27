import FormLabel from "@/components/theme/FormLabel";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import UIText from "@/components/theme/UIText";
import {Calendar} from "@/components/ui/calendar";
import {ClearFieldButton} from "@/components/theme/ClearFieldButton";
import * as React from "react";
import {useState} from "react";
import {useI18n} from "@/locales/client";

export const DatePickerWithLabel = ({rootClass, errors, touched, setFieldValue, label, disabled, fieldValue, name, onClear, defaultValue}) =>{

    const [calendarOpen, setCalendarOpen] = useState()
    const t = useI18n()

    return(
        <div className="flex flex-col">
            <FormLabel
                title={label}
                errors={errors}
                touched={touched}
            />
            <div className={'flex gap-4 items-center'}>
                <Popover
                    open={calendarOpen}
                    onOpenChange={setCalendarOpen}
                    className={"relative"}
                >
                    <PopoverTrigger asChild>
                        <div
                            className={cn(
                                "flex w-full ring-[1.5px] ring-input cursor-pointer rounded-md p-4 gap-4 items-center justify-start text-left font-normal relative",
                                calendarOpen && "border-0",
                                calendarOpen && "ring-ring dark:ring-ring"
                            )}
                        >
                            <CalendarIcon className="h-4 w-4" />
                            {fieldValue ?
                                <>{new Date(fieldValue).toLocaleDateString()}</>
                                // <UIText weight={'medium'} className={'rtl:font-sans'} text={fieldValue.toLocaleDateString()}/>
                                :
                                <UIText weight={'medium'} text={t('labels.pickDate')}/>
                            }
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                        <Calendar
                            mode="single"
                            selected={fieldValue}
                            onSelect={(date) => {
                                setFieldValue(name, date);
                                setCalendarOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>

                {/* Clear Field Button */}
                {fieldValue && onClear &&
                    <ClearFieldButton
                        onClick={onClear}
                    />
                }
            </div>
        </div>
    )
}