import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col gap-10">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(
				(item) => (
					<Link
						className="h-10 bg-red-400 text-center"
						key={item}
						href={"/events"}
					>
						{item}
					</Link>
				)
			)}
		</div>
	);
}
