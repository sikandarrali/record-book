"use client";
import {
	CircleCheckBig,
	Copyright,
	LogOut,
	NotebookPen,
	RefreshCw,
	SettingsIcon,
	Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "../ui/sheet";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {useCurrentLocale, useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import usePWAStatus from "@/lib/hooks/usePWAStatus";
import {Button} from "@/components/ui/button";
import {isActivePath} from "@/lib/routes";
import {DarkModeToggle} from "@/components/theme/DarkModeToggle";
import {Logo} from "@/components/nav/Logo";
import {Separator} from "@/components/ui/separator";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isPWAInstalled = usePWAStatus();
	const {setLoading} = useAuth()

	return (
		<div className="flex flex-col p-6 pt-8" dir={'ltr'}>

			<div className={'flex justify-between items-center gap-4 relative'}>

				<div className={'flex gap-8'}>
					<Logo/>
					<DarkModeToggle/>
				</div>


				<div className={'flex gap-4 items-center'}>
					{/* Reload Page */}
					<Button
						onClick={()=> {
							setLoading(true);
							window.location.reload();
						}}
						variant={'outline'}
						className="rounded-lg group cursor-pointer flex items-center justify-center select-none w-10 h-9 p-1"
					>
						<RefreshCw className="w-5 h-5" />
					</Button>

					{/* Open Sidebar Button */}
					<Button
						variant={'outline'}
						className={'p-3 rounded-2xl cursor-pointer'}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<svg className={'fill-primary'} width="24" height="20.57" viewBox="0 0 72 61" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="47.8049" strokeLinecap={"round"} height="11.1666" rx="5.58328" transform="matrix(-1 0 0 1 71.9545 0.878265)"/>
							<rect width="60.7074" strokeLinecap={"round"} height="11.1666" rx="5.58328" transform="matrix(-1 0 0 1 71.9545 25.2947)"/>
							<rect width="71.7074" strokeLinecap={"round"} height="11.1666" rx="5.58328" transform="matrix(-1 0 0 1 71.9545 49.7117)"/>
						</svg>
					</Button>
				</div>


			</div>

			{/* Sidebar */}
			<Sidebar open={isMenuOpen} onOpenChange={setIsMenuOpen} isPWAInstalled={isPWAInstalled} />
		</div>
	);
};

export default Navbar;

const Sidebar = ({ open, onOpenChange, isPWAInstalled }) => {
	const { onLogout } = useAuth();
	const {user} = useAuth()
	const t = useScopedI18n('navbar')
	const pathname = usePathname()

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="bg-muted border-l-0 px-0 outline-0 stroke-none">
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="h-full flex flex-col relative">

					{user ?
						<>
							{/* Logged In By Account Badge */}
							<Badge className={'self-start px-2 absolute top-2 lg:top-2 left-1/2 -translate-x-1/2'}>
								<UIText variant={'xs'} text={t('googleAccount')}/>
							</Badge>

							<div className="flex items-center -ml-4 mt-14 lg:mb-10" dir={'ltr'}>

								{/* Image */}
								{user?.prefs?.picture ?
									<div className="p-3 rounded-full self-start bg-muted shrink-0">
										<Image
											src={user?.prefs?.picture}
											width={80}
											height={80}
											className="rounded-full w-20 h-20 shadow-xl"
											alt=""
										/>
									</div>
									:
									<div className={"rounded-full border-[9px] border-primary w-[88px] h-[88px] self-start bg-primary text-muted shrink-0 mr-2 text-5xl flex items-center justify-center font-medium"}>
										{user?.name?.charAt(0)}
									</div>
								}

								{/* Name */}
								<div className={'flex flex-col text-ellipsis overflow-hidden'}>
									<UIText weight={'semibold'} className="pr-8 mt-2" text={user?.name} textOrientation={'left'}/>
									<UIText variant={'sm'} className="pr-8 text-ellipsis overflow-hidden" text={user?.email} textOrientation={'left'}/>
								</div>
							</div>

							<div className="flex flex-col px-6 mt-auto mb-6 lg:mt-10 gap-0.5">

								<MenuItem
									label={t('links.books')}
									href={"/books"}
									isActivePath={isActivePath(pathname, '/books')}
									icon={
										<NotebookPen className={cn("w-[18px] h-[18px] rtl:mt-1", isActivePath(pathname, '/books') && "text-muted")} />
									}
								/>

								<MenuItem
									label={t('links.diaries')}
									href={"/diaries"}
									isActivePath={isActivePath(pathname, '/diaries')}
									icon={
										<CircleCheckBig className={cn("w-[18px] h-[18px] rtl:mt-1", isActivePath(pathname, '/diaries')  && "text-muted")} />
									}
								/>

								<MenuItem
									label={t('links.groups')}
									href={"/groups"}
									isActivePath={isActivePath(pathname, '/groups')}
									icon={
										<Users className={cn("w-[18px] h-[18px] rtl:mt-1", isActivePath(pathname, '/groups')  && "text-muted")} />
									}
								/>

								<Separator/>

								<MenuItem
									label={t('links.settings')}
									href={"/settings"}
									isActivePath={isActivePath(pathname, '/settings')}
									icon={
										<SettingsIcon className={cn("w-[18px] h-[18px] rtl:mt-1", isActivePath(pathname, '/settings')  && "text-muted")} />
									}
								/>

								<Separator/>

								<div
									onClick={onLogout}
									className={cn(
										"flex items-center gap-2 rtl:gap-4 px-4 py-4 rounded-md group hover:bg-muted-foreground hover:text-muted cursor-pointer",
									)}
								>
									<LogOut className="w-[18px] h-[18px]" />
									<UIText weight={'semibold'} text={t('links.logout')} />
								</div>
							</div>

						</>
						:
						<div className={'mt-auto'}/>
					}

					<div className={'mx-6 !mt-4 px-4 pt-6 flex justify-center items-center gap-1'} dir={'ltr'}>
						<Copyright className={'w-3 h-3 stroke-[1.5]'}/>
						<span className={'font-medium text-sm'}>Sikandar Ali Chishty</span>
					</div>

					<div className={'flex gap-4 justify-center text-sm mt-8 mb-4'}>
						<Link
							href={'/privacy-policy'}
							className={cn(
								'font-medium',
								isActivePath(pathname, "/privacy-policy")  && "font-semibold text-primary"
							)}
						>
							Privacy Policy
						</Link>

						<Link
							href={'/terms-of-service'}
							className={cn(
								'font-medium',
								isActivePath(pathname, "/terms-of-service") && "font-semibold text-primary"
							)}
						>
							Terms of Service
						</Link>
					</div>
				</div>

			</SheetContent>
		</Sheet>
	);
};

const MenuItem = ({ label, href, isActivePath, icon }) => {
	const pathname = usePathname()
	const locale = useCurrentLocale()

	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-2 rtl:gap-4 px-4 py-4 rounded-md group hover:bg-muted-foreground hover:text-muted",
				isActivePath  && "bg-muted-foreground"
			)}
		>
			{icon}
			<UIText
				weight={'semibold'}
				className={cn(
					isActivePath  && "text-muted"
				)}
				text={label}
			/>
		</Link>
	);
};
