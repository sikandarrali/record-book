import FormLabel from "@/components/theme/FormLabel";
import {UITextInput} from "@/components/theme/UITextInput";
import * as React from "react";
import {cn} from "@/lib/utils";
import {UINumberInput} from "@/components/theme/UINumberInput";

export const NumberInputFieldWithLabel = ({rootClass, value, errors, touched, currency, label, className, onChange, onBlur, disabled, name, defaultValue}) =>{
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
            <UINumberInput
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                name={name}
                defaultValue={defaultValue}
                className={cn(className)}
                value={value}
                currency={currency}
            />
        </div>
    )
}