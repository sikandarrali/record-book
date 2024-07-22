import { Loader2Icon } from "lucide-react";
import {useScopedI18n} from "@/locales/client";
import {cn} from "@/lib/utils";
import UIText from "@/components/theme/UIText";

const Loader = ({hideText}) => {
	const t = useScopedI18n('general')
	return (
		<div className="px-10 py-16 flex flex-col gap-6 items-center justify-center ">
			<div
				className={"border-primary/20 h-8 w-8 rounded-full border-4 border-t-primary dark:border-primary/30 dark:border-t-primary"}
				style={{animation: "spin 1s linear infinite"}}
			/>

			{!hideText && <UIText className="font-medium text-muted-foreground" text={t('loadingData')}/>}
		</div>
	);
};

export default Loader;
