"use client";

const PagesProvider = ({ children }) => {
	return (
		<div
			// dir={'rtl'}
			className="relative max-w-screen-lg lg:max-w-[600px] mx-auto"
		>
			{children}
		</div>
	);
};

export default PagesProvider;
