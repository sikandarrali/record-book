import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const FixStickyHeaderScrollError = (scrollRef) => {
	const element = scrollRef.current;
	if (
		element &&
		!element.classList.contains("sticky") &&
		!element.classList.contains("fixed")
	) {
		element.scrollIntoView({ behavior: "smooth" });
	}
};

export const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
};