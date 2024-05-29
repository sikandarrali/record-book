"use client";
import PageContainer from "@/components/providers/PageContainer";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { useState } from "react";

const defaultData = [
	{ id: 1, name: "Pir Faisal Masood Faridabad", amount: 10000 },
	{ id: 2, name: "میاں نوید سابقہ ایم پی اے", amount: 8000 },
	{ id: 3, name: "Mansoor Lahore", amount: 5000 },
	{ id: 4, name: "Chaudhary Qayyum Renala Khurd", amount: 2000 },
	{ id: 5, name: "GM", amount: 1000 },
	{ id: 6, name: "Owais", amount: 5000 },
	{ id: 7, name: "Nomi", amount: 2000 },
	{ id: 8, name: "Pir Masood Dhaki", amount: 10000 },
	{ id: 9, name: "Dewan Ahmad Masood USA", amount: 20000 },
	{ id: 10, name: "Dewan Modood Masood Chishti", amount: 50000 },
];

const Page = () => {
	const [data, setData] = useState(defaultData);

	const totalSum = data?.reduce((acc, item) => acc + item.amount, 0);

	return (
		<PageContainer>
			<div className="sticky top-10 z-10 bg-white -mx-4 px-4 pt-4 pb-2 shadow-sm flex flex-col gap-4">
				<h2 className="text-2xl font-semibold text-primary">
					Sikandar Ki Mehndi
				</h2>
				<div className="flex gap-2 justify-end items-center relative">
					<span>Rs</span>
					<span className="font-bold text-xl">{totalSum}</span>
				</div>
			</div>

			<div className="fixed top-4 z-20 left-1/2 -translate-x-1/2 font-medium text-sm bg-white">
				10 March 2023
			</div>

			<div className="fixed top-4 z-20 right-4 font-semibold">
				<Settings />
			</div>

			<div className="flex flex-col pb-24 mt-4">
				<Input
					className="text-[16px] h-14 mb-4"
					placeholder="Type to search..."
				/>

				<div className="flex flex-col gap-2">
					{data.map((item) => (
						<SingleItem data={item} key={item} />
					))}
				</div>
			</div>
		</PageContainer>
	);
};

export default Page;

const SingleItem = ({ data }) => {
	return (
		<div className="bg-muted/50 hover:bg-muted p-4 rounded-md shadow cursor-pointer flex justify-between gap-4">
			<span className="font-medium">{data.name}</span>
			<div className="flex gap-2 justify-end items-center relative flex-shrink-0">
				<span className="text-sm">Rs</span>
				<span className="font-semibold text-xl">{data.amount}</span>
			</div>
		</div>
	);
};
