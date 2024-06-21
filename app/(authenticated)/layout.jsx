"use client";
import { useAuth } from "@/components/contexts/AuthContext";
import { DataProvider } from "@/components/contexts/DataContext";
import { useRouter } from "next/navigation";

export default function AuthenticatedPagesLayout({ children }) {
	const { user } = useAuth();
	const router = useRouter();

	return <DataProvider>{children}</DataProvider>;
}
