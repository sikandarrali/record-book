"use client";
import {redirect} from "next/navigation";
import {HOMEPAGE_ROUTE} from "@/lib/routes";

export default function Page() {

	redirect(HOMEPAGE_ROUTE)

	return <></>
}
