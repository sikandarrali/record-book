import * as Yup from "yup";
import {removeExtraSpaces} from "@/lib/schemas/removeExtraSpaces";

export const ProfileSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(100, "max100characters")
        .transform((value) => removeExtraSpaces(value))
        .required("required"),
});