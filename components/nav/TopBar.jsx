import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const TopBar = () => {
	return (
		<div className="flex justify-between p-4 -mx-4 fixed top-0 h-11 w-full bg-white z-20">
			<Link href={"/"}>
				<ArrowLeft />
			</Link>
		</div>
	);
};

export default TopBar;
