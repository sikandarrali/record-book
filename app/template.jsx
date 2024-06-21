"use client";
import { motion } from "framer-motion";

const template = ({ children }) => {
	return (
		<motion.div
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ ease: "easeInOut", duration: 0.75 }}
		>
			{children}
		</motion.div>
	);
};

export default template;
