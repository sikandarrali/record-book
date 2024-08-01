"use client";
import PageContainer from "@/components/providers/PageContainer";
import UIText from "@/components/theme/UIText";
import {AnimatePresence, motion} from "framer-motion";
import Link from "next/link";
import {useI18n} from "@/locales/client";
import {CircleCheckBig, MoveRight, NotebookPen, Users} from "lucide-react";
import {useAuth} from "@/components/contexts/AuthContext";
import {Separator} from "@/components/ui/separator";

export default function Page() {

	const t = useI18n()
	const {user} = useAuth()

	return (
		<PageContainer>

			<div className={'flex flex-col w-full gap-10'}>

				<div>
					<UIText text={t('pages.home.welcome')}/>
					<UIText text={user.name} weight={'semibold'}/>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: 0.3, ease: "easeInOut" },
					}}
					key={"books"}
					className={''}
				>
					<Link
						href={"/books"}
						className={'relative group p-10 border rounded-lg bg-muted/40 dark:bg-muted hover:bg-muted-foreground/10 dark:hover:bg-muted-foreground/10 flex flex-col w-full gap-4 transition-colors duration-500'}
					>
						<div className={'flex gap-4 items-center text-primary'}>
							<NotebookPen/>
							<UIText variant={'heading'} className={'break-all rtl:-mt-2'} text={t('pages.home.books.title')}/>
						</div>
						<UIText text={t('pages.home.books.p1')}/>
						<UIText text={t('pages.home.books.p2')} className={'text-muted-foreground'} weight={'medium'} variant={'sm'}/>
						<MoveRight className={'w-8 h-8 mt-6 text-primary rtl:-scale-x-100 rtl:mr-auto'}/>
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: 0.6, ease: "easeInOut" },
					}}
					key={"diaries"}
					className={''}
				>
					<Link
						href={"/diaries"}
						className={'relative group p-10 border rounded-lg bg-muted/40 dark:bg-muted hover:bg-muted-foreground/10 dark:hover:bg-muted-foreground/10 flex flex-col w-full gap-4 transition-colors duration-500'}
					>
						<div className={'flex gap-4 items-center text-primary'}>
							<CircleCheckBig/>
							<UIText variant={'heading'} className={'break-all rtl:-mt-2'} text={t('pages.home.diaries.title')}/>
						</div>
						<UIText text={t('pages.home.diaries.p1')}/>
						<UIText text={t('pages.home.diaries.p2')} className={'text-muted-foreground'} weight={'medium'} variant={'sm'}/>
						<MoveRight className={'w-8 h-8 mt-6 text-primary rtl:-scale-x-100 rtl:mr-auto'}/>
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: 0.9, ease: "easeInOut" },
					}}
					key={"separator"}
					className={''}
				>
					<Separator/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: 0.9, ease: "easeInOut" },
					}}
					key={"Groups"}
					className={''}
				>
					<Link
						href={"/groups"}
						className={'relative group p-10 border rounded-lg bg-muted/40 dark:bg-muted hover:bg-muted-foreground/10 dark:hover:bg-muted-foreground/10 flex flex-col w-full gap-4 transition-colors duration-500'}
					>
						<div className={'flex gap-4 items-center text-primary'}>
							<Users/>
							<UIText variant={'heading'} className={'break-all rtl:-mt-2'} text={t('pages.home.groups.title')}/>
						</div>
						<UIText text={t('pages.home.groups.p1')}/>
						<MoveRight className={'w-8 h-8 mt-6 text-primary rtl:-scale-x-100 rtl:mr-auto'}/>
					</Link>
				</motion.div>

			</div>

		</PageContainer>
	);
}
