"use client";

import { CalendarRange, Home, LogOut, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";

const Navbar = () => {
	const [isMenuOpen, setisMenuOpen] = useState(false);

	return (
		<div className="flex items-center justify-between sticky top-0 mb-4 bg-white shadow-sm -mx-6 py-4 px-6">
			<Image src={"/logo.png"} width={120} height={40} alt="Logo" />

			<Button
				variant="outline"
				size="icon"
				onClick={() => setisMenuOpen(!isMenuOpen)}
			>
				<MenuIcon />
			</Button>

			<Sidebar open={isMenuOpen} onOpenChange={setisMenuOpen} />
		</div>
	);
};

export default Navbar;

const Sidebar = ({ open, onOpenChange }) => {
	const { user, logout } = useAuth();

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="bg-primary border-l-0 px-0 outline-0 stroke-none">
				<div className="h-full flex flex-col">
					<div className="flex items-center -ml-4 my-14">
						<div className="p-3 rounded-full self-start bg-primary shrink-0">
							<Image
								src={"/person.png"}
								width={80}
								height={80}
								className="rounded-full w-20 h-20"
								alt=""
							/>
						</div>

						<p className="text-white font-semibold text-lg pr-8">
							{user?.name}
						</p>
					</div>

					<div className="flex flex-col px-6 h-full">
						<MenuItem
							label={"Home"}
							href={"/"}
							icon={<Home className="w-[18px] h-[18px]" />}
						/>
						<MenuItem
							label={"Events"}
							href={"/events"}
							icon={
								<CalendarRange className="w-[18px] h-[18px]" />
							}
						/>

						{/* <div className="absolute bottom-0 mb-6 w-full"> */}
						<div className="mt-auto mb-0 w-full">
							<div
								onClick={logout}
								className="flex cursor-pointer text-background hover:bg-muted hover:text-foreground items-center gap-2 px-4 py-4 rounded-md"
							>
								<LogOut className="w-[18px] h-[18px]" />
								<span className="text-base font-medium">
									Logout
								</span>
							</div>
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
