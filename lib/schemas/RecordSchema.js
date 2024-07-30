import * as Yup from "yup";
import {removeExtraSpaces} from "@/lib/schemas/removeExtraSpaces";

export const RecordSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(300, "max200characters")
        .transform((value) => removeExtraSpaces(value))
        .required("required"),
    amount: Yup.string()
        .min(1)
        .max(13, "max10numbers")
        .transform((value) => removeExtraSpaces(value))
        .required("required"),
    details: Yup.string()
        .min(1)
        .max(300, "max300characters")
        .transform((value) => removeExtraSpaces(value))
});