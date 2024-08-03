import {NumericFormat} from "react-number-format";

export const FormattedCurrency = ({value, currency, type, hidePlusMinus}) =>{

    // const plusMinus = !hidePlusMinus
    //     ? type === "income"
    //         ? "\u002B"
    //         : type === "expense" || value < 0
    //             ? "\u2212"
    //             : ""
    //     : "";

    const plusMinus = !hidePlusMinus
        && type === "expense" || value < 0 ? "\u2212" : "";

    const space = "\u00a0";

    const prefix = currency.symbol + space + plusMinus;
    const suffix = space  + currency.symbol;

    if(currency.name === "pkr"){
       return (
           <NumericFormat
               allowNegative={false}
               value={value < 0 ? Math.abs(Number(value)) : Number(value)}
               thousandSeparator={currency.thousandSeparator}
               decimalSeparator={currency.decimalSeparator}
               decimalScale={currency.decimalScale}
               displayType="text"
               prefix={prefix}
               thousandsGroupStyle="lakh"
           />
       )
    }
    else{
        return (
            <NumericFormat
                allowNegative={false}
                value={value < 0 ? Math.abs(Number(value)) : Number(value)}
                thousandSeparator={currency.thousandSeparator}
                decimalSeparator={currency.decimalSeparator}
                decimalScale={currency.decimalScale}
                displayType="text"
                prefix={plusMinus}
                suffix={suffix}
                thousandsGroupStyle={"thousand"}
            />
        )
    }
}