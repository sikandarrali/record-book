import {NumericFormat} from "react-number-format";

export const FormattedCurrency = ({value, currency}) =>{
    return(
        <NumericFormat
            allowNegative={false}
            value={value}
            thousandSeparator={currency.thousandSeparator}
            decimalSeparator={currency.decimalSeparator}
            displayType="text"
            decimalScale={currency.decimalScale}
        />
    )
}