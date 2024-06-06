"use client";
import { useAuth } from "@/components/contexts/AuthContext";
import Login from "@/components/login";
import PageContainer from "@/components/providers/PageContainer";
import Signup from "@/components/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
	const { user } = useAuth();
	const router = useRouter();

	return (
		<PageContainer hideNavbar>
			<div className="flex flex-col pt-8 w-full flex-1">
				<Image
					src={"/logo.png"}
					width={200}
					height={150}
					alt="Logo"
					className="mx-auto"
				/>

				<Tabs defaultValue="login" className="mt-10">
					<TabsList className="grid w-full grid-cols-2 h-12 ">
						<TabsTrigger value="login" className="h-full">
							Login
						</TabsTrigger>
						<TabsTrigger value="signup" className="h-full">
							Signup
						</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<Login />
					</TabsContent>
					<TabsContent value="signup">
						<Signup />
					</TabsContent>
				</Tabs>
			</div>
		</PageContainer>
	);
}
