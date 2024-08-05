"use client"
import { cn } from "@/lib/utils";
import {MoveLeft} from "lucide-react";
import UIText from "@/components/theme/UIText";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/nav/Navbar";
import {usePathname, useRouter} from "next/navigation";
import {LOCALE_HOME_ROUTE} from "@/lib/routes";
import {useAuth} from "@/components/contexts/AuthContext";

const PageContainer = ({ children, title, hideBackButton, className, headerTextOrientation, headerClass, hideNavbar }) => {
	const router = useRouter()
	const pathname = usePathname()
	const {user} = useAuth()

	return (
		<div
			className={cn(
				"flex flex-col w-full min-h-screen relative",
				className
			)}
		>
			{!hideNavbar && <Navbar />}
			<div className={cn(
				'p-6 pt-8 pb-20 min-h-screen flex flex-col w-full bg-card border border-border shadow-lg relative flex-1 rounded-t-[40px]',
			)}>
				<div className={cn('mb-4 grid grid-cols-5 w-full relative')} dir={'ltr'}>
					{!LOCALE_HOME_ROUTE.includes(pathname) && !hideBackButton &&
						<Button
							onClick={()=> router.back()}
							variant={'ghost'}
							className={'rounded-2xl z-20 cursor-pointer mr-4 shrink-0 flex w-12 h-11 p-1'}
						>
							<MoveLeft />
						</Button>
					}
					{title &&
						<UIText
							variant="heading"
							className={cn(
								'!text-primary pt-2 rtl:-mt-2.5 rtl:pt-0 col-span-4 rtl:pr-4',
								user?.prefs?.fontSize === "sm" && "pt-1.5 rtl:-mt-3 rtl:pt-0",
								user?.prefs?.fontSize === "lg" && "pt-1 rtl:-mt-3.5 rtl:pt-0",
								user?.prefs?.fontSize === "xl" && "pt-0.5 rtl:-mt-3 rtl:pt-0",
								headerClass,
								hideBackButton && "ml-0 rtl:mt-0 pl-0 mx-auto col-span-5",
							)}
							text={title}
							textOrientation={headerTextOrientation}
						/>
					}
				</div>
				{children}
			</div>
		</div>
	);
};

export default PageContainer;
