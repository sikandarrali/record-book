"use client";

import {
	CalendarRange,
	Copyright,
	Edit,
	Home,
	LogOut,
	MenuIcon,
	MoveLeft,
	RefreshCw,
	SettingsIcon, SquarePen,
	Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "../ui/sheet";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {usePathname, useRouter} from "next/navigation";
import {useCurrentLocale, useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import Logo from "../../public/logo.png"
import usePWAStatus from "@/lib/hooks/usePWAStatus";
import InstallApp from "@/components/InstallApp/InstallApp";
import {Button} from "@/components/ui/button";
import useIsIOS from "@/lib/hooks/useIsIOS";
import {HOMEPAGE_ROUTE} from "@/lib/routes";
import {ThemeModeToggle} from "@/components/theme/ThemeModeToggle";
import {Separator} from "@/components/ui/separator";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isPWAInstalled = usePWAStatus();
	const {user, setLoading} = useAuth()
	const isIOS = useIsIOS();
	const pathname = usePathname();
	const locale = useCurrentLocale()

	const router = useRouter()

	return (
		<div className="flex flex-col p-6 pt-8" dir={'ltr'}>

			<div className={'flex justify-between items-start gap-4'}>
				{pathname === HOMEPAGE_ROUTE || pathname === `/${locale}` ?
					<>
						{user?.prefs?.picture ?
							<div className={'flex gap-4'}>
								<div className="p-3 rounded-2xl overflow-hidden self-start bg-primary shrink-0 relative w-12 h-12">
									<Image
										src={user?.prefs?.picture}
										// width={40}
										// height={40}
										fill
										alt=""
									/>
								</div>
								<div className={'flex flex-col'}>
									<UIText text={'Hello,'}/>
									<UIText text={user?.name} weight={'semibold'}/>
								</div>
							</div>
							:
							<div className={"rounded-full border-4 border-primary w-12 p-4 h-12 self-start bg-muted text-primary text-4xl flex items-center justify-center font-medium"}>
								{user?.name?.charAt(0)}
							</div>
						}

					</>
					:
					<Button
						onClick={()=> router.back()}
						variant={'ghost'}
						className={'rounded-2xl cursor-pointer -ml-2 shrink-0 flex w-12 h-11 p-1'}
					>
						<MoveLeft />
					</Button>
				}

				<div className={'flex  items-center gap-4'}>
					<ThemeModeToggle/>
					<Button
						variant={'outline'}
						className={'border p-3 rounded-2xl cursor-pointer'}
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
				<div className="h-full flex flex-col">
					<div className="flex items-center -ml-4 mt-14 mb-10" dir={'ltr'}>
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

						<div className={'flex flex-col text-ellipsis overflow-hidden'}>
							<Badge className={'self-start px-2 '}>
								<UIText variant={'xs'} text={t('googleAccount')}/>
							</Badge>
							<UIText weight={'semibold'} className="pr-8 mt-2" text={user?.name}/>
							<UIText variant={'sm'} className="pr-8 text-ellipsis overflow-hidden" text={user?.email}/>
						</div>
					</div>

					<div className="flex flex-col px-6 h-full mt-10 gap-0.5">
						<MenuItem
							label={t('links.home')}
							href={"/"}
							icon={
								<Home className={cn("w-[18px] h-[18px] rtl:mt-1", pathname === "/"  && "text-muted")} />
							}
						/>

						<MenuItem
							label={t('links.groups')}
							href={"/groups"}
							icon={
								<Users className={cn("w-[18px] h-[18px] rtl:mt-1", pathname === "/groups"  && "text-muted")} />
							}
						/>


					</div>

					<div className="mb-0 mx-2 px-4 flex flex-col gap-0.5">
						<MenuItem
							label={t('links.settings')}
							href={"/settings"}
							icon={
								<SettingsIcon className={cn("w-[18px] h-[18px] rtl:mt-1", pathname === "/settings"  && "text-muted")} />
							}
						/>

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

					<div className={'mx-6 !mt-4 px-4 pt-6 flex justify-center items-center gap-1'} dir={'ltr'}>
						<Copyright className={'w-3 h-3 stroke-[1.5]'}/>
						<span className={'font-medium text-sm'}>Sikandar Ali Chishty</span>
					</div>

					<div className={'flex gap-4 justify-center text-sm mt-8 mb-4'}>
						<Link
							href={'/privacy-policy'}
							className={cn(
								'font-medium',
								pathname === "/privacy-policy"  && "font-semibold underline underline-offset-4"
							)}
						>
							Privacy Policy
						</Link>

						<Link
							href={'/terms-of-service'}
							className={cn(
								'font-medium',
								pathname === "/terms-of-service"  && "font-semibold underline underline-offset-4"
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

const MenuItem = ({ label, href, icon }) => {
	const pathname = usePathname()
	const locale = useCurrentLocale()

	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-2 rtl:gap-4 px-4 py-4 rounded-md group hover:bg-muted-foreground hover:text-muted",
				pathname === href  && "bg-muted-foreground"
			)}
		>
			{icon}
			<UIText
				weight={'semibold'}
				className={cn(
					pathname === href  && "text-muted"
				)}
				text={label}
			/>
		</Link>
	);
};
