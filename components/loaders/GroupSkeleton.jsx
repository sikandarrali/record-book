const ItemsSkeleton = () => {
	return (
		<div className="relative text-left px-4 py-7 max-w-sm w-full mx-auto gap-4 justify-between border-b last-of-type:border-b-0 transition-all duration-300">
			<div className="animate-pulse flex space-x-4 w-full">
				<div className="flex flex-1 w-full">
					<div className="flex flex-col w-[75%] gap-4 ">
						<div className="h-2 bg-slate-200 rounded col-span-2"></div>
					</div>
					<div className="flex flex-col w-[15%] ml-auto gap-4 ">
						<div className="h-2  bg-slate-200 rounded col-span-2"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ItemsSkeleton;
