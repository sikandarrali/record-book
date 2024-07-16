import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import { Label } from "../ui/label";
import {useI18n, useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

const FormLabel = ({ title, touched, errors, requiredClassName }) => {
	const t = useScopedI18n('general')
	return (
		<Label
			className={cn(
				"relative text-sm flex items-center justify-between gap-4 rtl:flex-row",
				errors && touched && "text-red-500"
			)}
		>
			<UIText className="shrink-0">{title}</UIText>

			{errors && touched && (
				<span
					className={cn(
						"text-xs flex items-center ltr:ml-auto",
						requiredClassName
					)}
				>
					<Asterisk className="w-4 h-4 shrink-0 mr-1" />
					<UIText>{t(`label.${errors}`)}</UIText>
				</span>
			)}
		</Label>
	);
};

export default FormLabel;
