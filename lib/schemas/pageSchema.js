import * as Yup from "yup";
import {removeExtraSpaces} from "@/lib/schemas/removeExtraSpaces";

export const PageSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(300, "max200characters")
        .transform((value) => removeExtraSpaces(value))
        .required("required"),
    date: Yup.string(),
    details: Yup.string().min(1).transform((value) => removeExtraSpaces(value)).max(300, "max300characters"),
})