"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const LoadingFallback = () => {
	const [showSlowNetworkMessage, setShowSlowNetworkMessage] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowSlowNetworkMessage(true);
		}, 5000);
	}, []);

	return (
		<div className="fixed inset-0 z-[10000] bg-muted flex flex-col gap-4 items-center justify-center">
			<Loader2 className="animate-spin w-10 h-10 text-primary" />
			{showSlowNetworkMessage && (
				<p className="text-sm">slow network detected, please wait...</p>
			)}
		</div>
	);
};

export default LoadingFallback;
