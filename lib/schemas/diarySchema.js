import * as Yup from "yup";
import {removeExtraSpaces} from "@/lib/schemas/removeExtraSpaces";

export const DiarySchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(300, "max200characters")
        .transform((value) => removeExtraSpaces(value))
        .required("required"),
})