"use client";

import {CalendarRange, Copyright, Edit, Edit2, Heart, Home, LogOut, MenuIcon, Users} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "../ui/sheet";
import {useMyStore} from "@/store/store";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";
import LanguageSwitcher from "@/components/nav/LangugeSwitcher";
import {EditProfile} from "@/components/nav/EditProfile";
import {Progress} from "@/components/ui/progress";
import {useData} from "@/components/contexts/DataContext";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<div>
			{/*<Progress value={33} className={'-mx-6 rounded-none w-screen h-1'} />*/}
			<div className="flex items-center justify-between sticky top-0 mb-4 bg-white shadow-sm -mx-6 py-4 px-6">
				<Link href={'/events'} className={'cursor-pointer'}>
					<Image src={"/logo.png"} width={120} height={47} alt="Logo" priority />
				</Link>

				<Button
					variant="outline"
					size="icon"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					<MenuIcon />
				</Button>

				<Sidebar open={isMenuOpen} onOpenChange={setIsMenuOpen} />
			</div>
		</div>
	);
};

export default Navbar;

const Sidebar = ({ open, onOpenChange }) => {
	const { onLogout } = useAuth();
	const {user} = useAuth()
	const [openEditProfile, setOpenEditProfile] = useState(false)

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="bg-primary border-l-0 px-0 outline-0 stroke-none">
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="h-full flex flex-col">
					<div className="flex items-center -ml-4 mt-14 mb-10">
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


					{/*<div className={'flex items-center justify-between flex-1 px-10'}>*/}
					{/*	<p className={'text-muted font-medium'}>Language</p>*/}
					{/*	<LanguageSwitcher />*/}
					{/*</div>*/}

					<div className="flex flex-col px-6 h-full mt-10">
						<MenuItem
							label={"Events"}
							href={"/events"}
							icon={
								<CalendarRange className="w-[18px] h-[18px]" />
							}
						/>

						<MenuItem
							label={"Groups"}
							href={"/groups"}
							icon={
								<Users className="w-[18px] h-[18px]" />
							}
						/>

					</div>

					<div className="mb-0 mx-2 px-4 space-y-2">
						<div
							className="flex text-background hover:bg-muted hover:text-foreground items-center gap-2 px-4 py-4 hover:rounded-md cursor-pointer"
							onClick={()=> setOpenEditProfile(true)}
						>
							<Edit className="w-[18px] h-[18px]" />
							<span className="text-base font-medium">Edit Profile</span>
						</div>
						<div
							onClick={onLogout}
							className="flex cursor-pointer text-background hover:bg-muted hover:text-foreground items-center gap-2 px-4 py-4 rounded-md"
						>
							<LogOut className="w-[18px] h-[18px]" />
							<span className="text-base font-medium">Logout</span>
						</div>
					</div>

					<div className={'mx-6 !mt-4 px-4 pt-6 text-muted flex items-center gap-1'}>
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
	return (
		<Link
			href={href}
			className="flex text-background hover:bg-muted hover:text-foreground items-center gap-2 px-4 py-4 rounded-md"
		>
			{icon}
			<span className="text-base font-medium">{label}</span>
		</Link>
	);
};
