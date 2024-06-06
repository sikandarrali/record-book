"use client";

const PagesProvider = ({ children }) => {
	return (
		<div className="relative max-w-screen-lg lg:max-w-[600px] mx-auto">
			<div className="">{children}</div>
			{/* <BottomBar /> */}
		</div>
	);
};

export default PagesProvider;
