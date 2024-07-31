import * as React from "react";

import {cn, isFontSizeAllowed} from "@/lib/utils";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {useRef, useState} from "react";
import {useAuth} from "@/components/contexts/AuthContext";
import {cva} from "class-variance-authority";
import {NumericFormat} from "react-number-format";

export const UINumberInput = ({className, currency, variant, type, onChange, ...props}) => {

    const [localValue, setLocalValue] = useState("")
    const inputRef = useRef(null)
    const {user} = useAuth()
    const prefs = user?.prefs
    const isUrdu = isStringUrdu(localValue)

    const fontSize = isFontSizeAllowed(prefs?.fontSize) ? prefs.fontSize : 'base';

    const onInputChange = (event) =>{
        setLocalValue(event.target.value)
       if(onChange) onChange(event)
    }

    const typography = [
        {
            name: "sm",
            body: `text-base ${isUrdu && "leading-8 pb-2"}`,
        },
        {
            name: "base",
            body: `text-lg ${isUrdu && "leading-10 pb-2"}`,
        },
        {
            name: "lg",
            body: `text-xl h-18 ${isUrdu && "leading-12 pb-3"}`,
        },
        {
            name: "xl",
            body: `text-2xl h-20 ${isUrdu && "leading-14 pb-4"}`,
        }
    ]

    const typographyMap = typography.reduce((map, item) => {
        map[item.name] = item;
        return map;
    }, {});
    const selectedTypography = typographyMap[fontSize];

    const defaultStyles = "flex min-h-12 w-full rounded-md text-[16px] border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
    const inputVariants = cva([defaultStyles], {
        variants: {
            variant: {
                body: selectedTypography.body
            }
        },
        defaultVariants: {
            variant: "body",
        },
    });

    return (
        <NumericFormat
            allowNegative={false}
            thousandSeparator={currency.thousandSeparator}
            decimalSeparator={currency.decimalSeparator}
            decimalScale={currency.decimalScale}
            thousandsGroupStyle={currency.thousandsGroupStyle}
            allowedDecimalSeparators={currency.allowedDecimalSeparators}
            name="amount"
            inputMode="decimal"
            autoComplete="off"
            className={cn(
                inputVariants({variant, className}),
                isUrdu ? 'font-urdu' : 'font-sans',
                localValue === "" && "ltr:font-sans rtl:font-urdu"
            )}
            onChange={(e)=> onInputChange(e)}
            {...props}
        />
    );
}