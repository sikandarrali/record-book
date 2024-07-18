"use client";

import {CalendarRange, Copyright, Edit, LogOut, MenuIcon, Users} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "../ui/sheet";
import {Badge} from "@/components/ui/badge";
import {EditProfile} from "@/components/nav/EditProfile";
import {cn} from "@/lib/utils";
import {usePathname, useRouter} from "next/navigation";
import LanguageSwitcher from "@/components/nav/LanguageSwitcher";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import Logo from "../../public/logo.png"
import usePWAStatus from "@/lib/hooks/usePWAStatus";
import InstallApp from "@/components/InstallApp/InstallApp";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isPWAInstalled = usePWAStatus();
	const router = useRouter()
	const pathname = usePathname()

	const onLogoClick = () =>{
		if(pathname !== "/events"){
			router.push('/events')
		}
	}

	return (
		<div dir={'ltr'}>
			<div className="flex items-center justify-between sticky top-0 mb-4 bg-white shadow-sm -mx-6 py-4 px-6">

				<Image
					src={Logo}
					width={120}
					height={47}
					alt="Logo"
					priority
					className={'cursor-pointer'}
					onClick={()=> onLogoClick()}
				/>

				<div className={'flex items-center gap-5'}>

					{isPWAInstalled ?
						<LanguageSwitcher />
						:
						<InstallApp/>
					}
					<div
						className={'border p-2 rounded-md hover:bg-muted cursor-pointer'}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<MenuIcon />
					</div>
				</div>

				<Sidebar open={isMenuOpen} onOpenChange={setIsMenuOpen} isPWAInstalled={isPWAInstalled} />
			</div>
		</div>
	);
};

export default Navbar;

const Sidebar = ({ open, onOpenChange, isPWAInstalled }) => {
	const { onLogout } = useAuth();
	const {user} = useAuth()
	const [openEditProfile, setOpenEditProfile] = useState(false)
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
							<Badge variant={'secondary'} className={'self-start text-[10px] px-2'}>Google</Badge>
							<p className="text-white font-semibold pr-8 mt-2">
								{user?.name}
							</p>
							<p className="text-white text-sm pr-8 text-ellipsis overflow-hidden">
								{user?.email}
							</p>
						</div>
					</div>

					{!isPWAInstalled &&
						<LanguageSwitcher light inSidebar />
					}

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
						<div
							className="flex text-background hover:bg-muted hover:text-foreground items-center gap-2 px-4 py-4 hover:rounded-md cursor-pointer"
							onClick={()=> setOpenEditProfile(true)}
						>
							<Edit className="w-[18px] h-[18px]" />
							<UIText weight={'semibold'}>{t('linkEditProfile')}</UIText>
						</div>
						<div
							onClick={onLogout}
							className="flex cursor-pointer text-background hover:bg-muted hover:text-foreground items-center gap-2 px-4 py-4 rounded-md"
						>
							<LogOut className="w-[18px] h-[18px]" />
							<UIText weight={'semibold'}>{t('linkLogout')}</UIText>
						</div>
					</div>

					<div className={'mx-6 !mt-4 px-4 pt-6 text-muted flex justify-center items-center gap-1'} dir={'ltr'}>
						<Copyright className={'w-3 h-3 stroke-[1.5]'}/>
						<span className={'font-medium text-xs'}>Sikandar Ali Chishty</span>
					</div>
				</div>


			</SheetContent>

			<EditProfile open={openEditProfile} onOpenChange={setOpenEditProfile}/>
		</Sheet>
	);
};

const MenuItem = ({ label, href, icon }) => {
	const pathname = usePathname()

	return (
		<Link
			href={href}
			className={cn("flex text-background items-center gap-2 px-4 py-4 rounded-md hover:bg-muted hover:text-foreground",
				pathname.toString() === href.toString() && "bg-muted text-foreground")}
		>
			{icon}
			<UIText weight={'semibold'}>{label}</UIText>
		</Link>
	);
};
