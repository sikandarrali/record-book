import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const TopBar = () => {
	return (
		<div className="flex justify-between p-4 pl-0 fixed top-0 h-14 w-full bg-white">
			<Link href={"/"}>
				<ArrowLeft />
			</Link>
		</div>
	);
};

export default TopBar;
