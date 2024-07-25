import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import { Label } from "../ui/label";
import {useI18n, useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";

const FormLabel = ({ title, touched, errors, requiredClassName }) => {
	const t = useI18n()
	return (
		<Label
			className={cn(
				"relative text-sm flex items-center mb-1 justify-between gap-4 rtl:flex-row",
				errors && touched && "text-destructive"
			)}
		>
			<UIText variant={'label'} text={title}/>

			{errors && touched && (
				<span
					className={cn(
						"text-xs flex items-center ltr:ml-auto",
						requiredClassName
					)}
				>
					<Asterisk className="w-4 h-4 shrink-0 mr-1" />
					<UIText variant={'xs'} text={t(`labels.${errors}`)}/>
				</span>
			)}
		</Label>
	);
};

export default FormLabel;
