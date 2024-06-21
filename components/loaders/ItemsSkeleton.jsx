const ItemsSkeleton = () => {
	return (
		<div className="border-t p-4 max-w-sm w-full mx-auto">
			<div className="animate-pulse flex space-x-4">
				<div className="flex flex-1 w-full">
					<div className="flex flex-col w-[65%] gap-4 ">
						<div className="h-2 bg-slate-200 rounded col-span-2"></div>
						<div className="h-2 w-3/4 bg-slate-200 rounded col-span-2"></div>
					</div>
					<div className="flex flex-col w-[25%] ml-auto gap-4 ">
						<div className="h-2  bg-slate-200 rounded col-span-2"></div>
						<div className="h-2 bg-slate-200 rounded col-span-2"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ItemsSkeleton;
