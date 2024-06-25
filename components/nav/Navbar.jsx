"use client";

import {CalendarRange, Heart, Home, LogOut, MenuIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "../ui/sheet";
import {useMyStore} from "@/store/store";
import {db} from "@/components/appwrite/database";
import {Query} from "appwrite";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<div className="flex items-center justify-between sticky top-0 mb-4 bg-white shadow-sm -mx-6 py-4 px-6">
			<Image src={"/logo.png"} width={120} height={47} alt="Logo" priority />

			<Button
				variant="outline"
				size="icon"
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			>
				<MenuIcon />
			</Button>

			<Sidebar open={isMenuOpen} onOpenChange={setIsMenuOpen} />
		</div>
	);
};

export default Navbar;

const Sidebar = ({ open, onOpenChange }) => {
	const { onLogout } = useAuth();
	const {user} = useAuth()

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="bg-primary border-l-0 px-0 outline-0 stroke-none">
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="h-full flex flex-col">
					<div className="flex items-center -ml-4 my-14">
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

						<div className={'flex flex-col gap-2'}>
							<span className={'text-xs text-muted'}>Logged in as:</span>
							<p className="text-white font-semibold text-xl pr-8">
								{user?.name}
							</p>
						</div>
					</div>

					<div className="flex flex-col px-6 h-full mt-20 gap-4">
						<MenuItem
							label={"Events"}
							href={"/events"}
							icon={
								<CalendarRange className="w-[18px] h-[18px]" />
							}
						/>

						<div className="mb-0 w-full">
							<div
								onClick={onLogout}
								className="flex cursor-pointer text-background hover:bg-muted hover:text-foreground items-center gap-2 px-4 py-4 rounded-md"
							>
								<LogOut className="w-[18px] h-[18px]" />
								<span className="text-base font-medium">
									Logout
								</span>
							</div>
						</div>

						<div className={'px-5 pb-4 text-muted mt-auto flex flex-col gap-1 items-center'}>
							<p className={'flex items-center text-xs gap-1'}>
								<span>Created with</span>
								<span><Heart className={'w-3.5 h-3.5'} /></span>
								<span>by</span>
							</p>
							<span className={'font-semibold text-sm'}>Sikandar Ali Chishty</span>
						</div>
					</div>
				</div>


			</SheetContent>
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
