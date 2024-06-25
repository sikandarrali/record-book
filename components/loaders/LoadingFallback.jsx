"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const LoadingFallback = () => {
	const [showSlowNetworkMessage, setShowSlowNetworkMessage] = useState(false);
	const [timedOut, setTimedOut] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setShowSlowNetworkMessage(true);
		}, 5000);


		setTimeout(() => {
			setTimedOut(true);
		}, 120000);
	}, []);

	return (
		<div className="fixed inset-0 z-[10000] bg-muted flex flex-col gap-4 items-center justify-center">
			{timedOut ? <p className="text-sm">Cannot load, looks like you are not connected to internet.<br/>Please make sure you have a working internet.</p>
			:
				<>
					<Loader2 className="animate-spin w-10 h-10 text-primary" />
					{showSlowNetworkMessage && (
						<p className="text-sm">slow network detected, please wait...</p>
					)}
				</>
			}
		</div>
	);
};

export default LoadingFallback;
