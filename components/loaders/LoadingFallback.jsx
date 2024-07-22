"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const LoadingFallback = ({hideMessage}) => {
	const [showSlowNetworkMessage, setShowSlowNetworkMessage] = useState(false);
	const [timedOut, setTimedOut] = useState(false)
	const router = useRouter()

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
					<div
						className={"border-primary/20 h-8 w-8 rounded-full border-4 border-t-primary dark:border-primary/30 dark:border-t-primary"}
						style={{animation: "spin 1s linear infinite"}}
					/>
					{!hideMessage && showSlowNetworkMessage && (
						<div className={'flex flex-col gap-6'}>
							<p className="text-sm">{`it's taking too long...`}</p>
							<Button onClick={()=> router.refresh()}>Reload App</Button>
						</div>
					)}
				</>
			}
		</div>
	);
};

export default LoadingFallback;
