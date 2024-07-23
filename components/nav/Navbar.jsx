"use client";

import {CalendarRange, Copyright, Edit, LogOut, MenuIcon, RefreshCw, SettingsIcon, Users} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "../ui/sheet";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {usePathname, useRouter} from "next/navigation";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import Logo from "../../public/logo.png"
import usePWAStatus from "@/lib/hooks/usePWAStatus";
import InstallApp from "@/components/InstallApp/InstallApp";
import {Button} from "@/components/ui/button";
import useIsIOS from "@/lib/hooks/useIsIOS";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isPWAInstalled = usePWAStatus();
	const {user, setLoading} = useAuth()
	const isIOS = useIsIOS();

	return (
		<div className="flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm p-4" dir={'ltr'}>

			<Link href={'/events'}>
				<Image
					src={Logo}
					width={120}
					height={47}
					alt="Logo"
					priority
					className={'cursor-pointer'}
				/>
			</Link>

			{user &&
				<div className={'flex items-center gap-6'}>
					{!isPWAInstalled && !isIOS ?
						<InstallApp/>
						:
						<Button
							size={'icon'}
							variant={'secondary'}
							onClick={()=> {
								setLoading(true)
								setTimeout(()=>{
									window.location.reload()
								}, 1000)
							}}
						>
							<RefreshCw/>
						</Button>
					}
					<div
						className={'border p-2 rounded-md hover:bg-muted cursor-pointer'}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<MenuIcon />
					</div>
				</div>
			}

			<Sidebar open={isMenuOpen} onOpenChange={setIsMenuOpen} isPWAInstalled={isPWAInstalled} />
		</div>
	);
};

export default Navbar;

const Sidebar = ({ open, onOpenChange, isPWAInstalled }) => {
	const { onLogout } = useAuth();
	const {user} = useAuth()
	const t = useScopedI18n('navbar')

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="bg-primary border-l-0 px-0 outline-0 stroke-none">
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="h-full flex flex-col">
					<div className="flex items-center -ml-4 mt-14 mb-10" dir={'ltr'}>
						{user?.prefs?.picture ?
							<div className="p-3 rounded-full self-start bg-primary shrink-0">
								<Image
									src={user?.prefs?.picture}
									width={80}
									height={80}
									className="rounded-full w-20 h-20 shadow-xl"
									alt=""
								/>
							</div>
							:
							<div className={"rounded-full border-[9px] border-primary w-[88px] h-[88px] self-start bg-muted text-primary shrink-0 mr-2 text-5xl flex items-center justify-center font-medium"}>
								{user?.name?.charAt(0)}
							</div>
						}

						<div className={'flex flex-col text-ellipsis overflow-hidden'}>
							<Badge variant={'secondary'} className={'self-start px-2'}>
								<UIText variant={'xs'} text={t('googleAccount')}/>
							</Badge>
							<UIText weight={'semibold'} className="text-white pr-8 mt-2" text={user?.name}/>
							<UIText variant={'sm'} className="text-white pr-8 text-ellipsis overflow-hidden" text={user?.email}/>
						</div>
					</div>

					<div className="flex flex-col px-6 h-full mt-10 gap-0.5">
						<MenuItem
							label={t('linkEvents')}
							href={"/events"}
							icon={
								<CalendarRange className="w-[18px] h-[18px]" />
							}
						/>

						<MenuItem
							label={t('linkGroups')}
							href={"/groups"}
							icon={
								<Users className="w-[18px] h-[18px]" />
							}
						/>

					</div>

					<div className="mb-0 mx-2 px-4 gap-0.5">
						<MenuItem
							label={t('linkSettings')}
							href={"/settings"}
							icon={
								<SettingsIcon className="w-[18px] h-[18px] rtl:mt-1" />
							}
						/>
						<div
							onClick={onLogout}
							className="flex cursor-pointer text-background hover:bg-muted hover:text-foreground items-center gap-2 px-4 py-4 rounded-md"
						>
							<LogOut className="w-[18px] h-[18px]" />
							<UIText weight={'semibold'} text={t('linkLogout')} />
						</div>
					</div>

					<div className={'mx-6 !mt-4 px-4 pt-6 text-muted flex justify-center items-center gap-1'} dir={'ltr'}>
						<Copyright className={'w-3 h-3 stroke-[1.5]'}/>
						<span className={'font-medium text-sm'}>Sikandar Ali Chishty</span>
					</div>

					<div className={'flex gap-4 justify-center text-sm text-muted mt-8 mb-4'}>
						<Link href={'/privacy-policy'}>Privacy Policy</Link>
						<Link href={'/terms-of-service'}>Terms of Service</Link>
					</div>
				</div>

			</SheetContent>
		</Sheet>
	);
};

const MenuItem = ({ label, href, icon }) => {
	const pathname = usePathname()

	return (
		<Link
			href={href}
			className={cn("flex text-background items-center gap-2 rtl:gap-4 px-4 py-4 rounded-md hover:bg-muted hover:text-foreground",
				pathname.toString() === href.toString() && "bg-muted text-foreground")}
		>
			{icon}
			<UIText weight={'semibold'} text={label} />
		</Link>
	);
};
