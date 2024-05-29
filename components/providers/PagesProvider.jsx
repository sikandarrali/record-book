import BottomBar from "../nav/BottomBar";

const PagesProvider = ({ children }) => {
	return (
		<div className="relative">
			<div className="">{children}</div>

			<BottomBar />
		</div>
	);
};

export default PagesProvider;
