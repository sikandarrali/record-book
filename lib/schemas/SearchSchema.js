import * as Yup from "yup";
import {removeExtraSpaces} from "@/lib/schemas/removeExtraSpaces";

export const SearchSchema = Yup.object().shape({
    value: Yup.string()
        .min(1, "min1character")
        .transform((value) => removeExtraSpaces(value))
        .required("required"),
});