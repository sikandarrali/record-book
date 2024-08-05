import { Loader2Icon } from "lucide-react";
import {useScopedI18n} from "@/locales/client";
import {cn} from "@/lib/utils";
import UIText from "@/components/theme/UIText";

const Loader = ({hideText, message}) => {
	const t = useScopedI18n('general')
	return (
		<div className="px-4 py-16 flex flex-col gap-6 items-center justify-center ">
			<div
				className={"border-muted-foreground/20 h-8 w-8 rounded-full border-4 border-t-muted-foreground dark:border-muted-foreground/20 dark:border-t-muted-foreground"}
				style={{animation: "spin 1s linear infinite"}}
			/>

			{!hideText && <UIText textOrientation={'center'} className="font-medium text-muted-foreground" text={message || t('loadingData')}/>}
		</div>
	);
};

export default Loader;
