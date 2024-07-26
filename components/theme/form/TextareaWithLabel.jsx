import FormLabel from "@/components/theme/FormLabel";
import * as React from "react";
import {cn} from "@/lib/utils";
import {UITextArea} from "@/components/theme/UITextArea";

export const TextareaWithLabel = ({rootClass, errors, touched, label, value, className, onChange, onBlur, disabled, name, defaultValue}) =>{
    return(
        <div className={cn(
            "flex flex-col",
            rootClass
        )}>
            <FormLabel
                title={label}
                errors={errors}
                touched={touched}
            />
            <UITextArea
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                disabled={disabled}
                defaultValue={defaultValue}
                className={cn(className)}
                value={value}
            />
        </div>
    )
}