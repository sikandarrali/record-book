import FormLabel from "@/components/theme/FormLabel";
import {UITextInput} from "@/components/theme/UITextInput";
import * as React from "react";
import {cn} from "@/lib/utils";

export const InputFieldWithLabel = ({rootClass, value, errors, touched, placeholder, label, className, onChange, onBlur, disabled, name, defaultValue}) =>{
    return(
        <div className={cn(
            "flex w-full flex-col",
            rootClass
        )}>
            <FormLabel
                title={label}
                errors={errors}
                touched={touched}
            />
            <UITextInput
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                disabled={disabled}
                defaultValue={defaultValue}
                className={className}
                value={value}
                placeholder={placeholder}
            />
        </div>
    )
}