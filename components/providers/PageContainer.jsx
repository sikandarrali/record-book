import { cn } from "@/lib/utils";
import {MoveLeft} from "lucide-react";
import UIText from "@/components/theme/UIText";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/nav/Navbar";
import {usePathname, useRouter} from "next/navigation";
import {LOCALE_HOME_ROUTE} from "@/lib/routes";

const PageContainer = ({ children, title, hideBackButton, className, hideNavbar }) => {
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div
			className={cn(
				"flex flex-col w-full min-h-screen relative",
				className
			)}
		>
			{!hideNavbar && <Navbar />}
			<div className={cn(
				'p-6 pt-8 pb-20 flex flex-col w-full bg-white border-t border-border shadow-top-only dark:bg-black/70 relative flex-1 rounded-t-[40px]',
			)}>
				<div className={cn('flex mb-4 justify-center')} dir={'ltr'}>
					{!LOCALE_HOME_ROUTE.includes(pathname) && !hideBackButton &&
						<Button
							onClick={()=> router.back()}
							variant={'ghost'}
							className={'rounded-2xl cursor-pointer shrink-0 flex w-12 h-11 p-1 absolute left-5 top-6 z-10'}
						>
							<MoveLeft />
						</Button>
					}
					{title &&
						<UIText
							variant="heading"
							className={cn(
								'!text-primary',
								hideBackButton && "ml-0 rtl:mt-0"
							)}
							text={title}
						/>
					}
				</div>
				{children}
			</div>
		</div>
	);
};

export default PageContainer;
