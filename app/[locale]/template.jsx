"use client";
import { motion } from "framer-motion";
import {useParams, usePathname} from "next/navigation";

const Template = ({ children }) => {
	const pathname = usePathname()
	return (
		// <motion.div
		// 	initial={{ y: 5, opacity: 0 }}
		// 	animate={{ y: 0, opacity: 1 }}
		// 	transition={{ ease: "easeInOut", duration: 0.75 }}
		// 	key={pathname}
		// >
		<>
			{children}
		</>
		// </motion.div>
	);
};

export default Template;
