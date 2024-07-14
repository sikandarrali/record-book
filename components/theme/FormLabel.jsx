import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import { Label } from "../ui/label";
import {useTranslations} from "next-intl";

const FormLabel = ({ title, touched, errors, requiredClassName }) => {
	const t = useTranslations('general.label')
	return (
		<Label
			className={cn(
				"relative text-sm flex items-center justify-between gap-4",
				errors && touched && "text-red-500"
			)}
		>
			<span className="shrink-0">{title}</span>

			{errors && touched && (
				<span
					className={cn(
						"text-xs flex items-center ml-auto",
						requiredClassName
					)}
				>
					<Asterisk className="w-4 h-4 shrink-0 mr-1" />
					<span>{t(errors)}</span>
				</span>
			)}
		</Label>
	);
};

export default FormLabel;
