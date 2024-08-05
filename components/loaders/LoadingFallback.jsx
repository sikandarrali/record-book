"use client";
import { useEffect, useState } from "react";
import {Button} from "@/components/ui/button";

const LoadingFallback = ({hideMessage}) => {
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
		<div className="fixed inset-0 z-[10000] dark:bg-foreground flex flex-col gap-4 items-center justify-center">
			{timedOut ? <p className="text-sm">Cannot load, looks like you are not connected to internet.<br/>Please make sure you have a working internet.</p>
			:
				<>
					<div
						className={"border-muted-foreground/20 h-8 w-8 rounded-full border-4 border-t-muted-foreground dark:border-muted-foreground/20 dark:border-t-muted-foreground"}
						style={{animation: "spin 1s linear infinite"}}
					/>
					{!hideMessage && showSlowNetworkMessage && (
						<div className={'flex flex-col gap-6'} dir={'ltr'}>
							<p className="text-sm">{`it's taking too long...`}</p>
							<Button onClick={()=> window.location.reload()}>Reload App</Button>
						</div>
					)}
				</>
			}
		</div>
	);
};

export default LoadingFallback;
