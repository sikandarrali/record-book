"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {cn, scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import {Plus, XIcon} from "lucide-react";
import {useState} from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {Permission, Role} from "appwrite";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select"
import {useAuth} from "@/components/contexts/AuthContext";
import {Label} from "@/components/ui/label";
import {useData} from "@/components/contexts/DataContext";
import UIText from "@/components/theme/UIText";
import {SheetStylesFlexibleHeight, SheetStylesMAxHeight90} from "@/lib/reusableStyles";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useScopedI18n} from "@/locales/client";
import {isStringUrdu} from "@/lib/isStringUrdu";


const AddEventSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	date: Yup.string().min(1).max(300, "max 300 characters"),
	venue: Yup.string().min(1).max(300, "max 300 characters"),
	details: Yup.string().min(1).max(300, "max 300 characters"),
});

export const AddEvent = ({ open, onOpenChange, userOwnedGroups }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState(null)
	const {user} = useAuth()
	const [addEventDetails, setAddEventDetails] = useState(false)
	const t = useScopedI18n('events')

	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		try {
			const eventData = {
				name: values.name,
				date: values.date,
				venue: values.venue,
				details: values.details,
				teamId: selectedGroup
			};
			if(selectedGroup){
				await db.events.create(eventData, [
					Permission.read(Role.team(selectedGroup, "member")),
					Permission.update(Role.team(selectedGroup, "member")),
					Permission.delete(Role.team(selectedGroup, "member")),
					Permission.read(Role.user(user.$id)),
					Permission.update(Role.user(user.$id)),
					Permission.delete(Role.user(user.$id)),
				]);
			}else{
				await db.events.create(eventData, );
			}
			onOpenChange(false);
			toast.success(t("alertEventCreated"), ToastOptions);
			setAdding(false);
			setDisabled(false);
			scrollToTop()
		} catch (error) {
			toast.error(t('alertException'), ToastOptions);
			setAdding(false);
			setDisabled(false);
		}
	};


	return (
		<Sheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14", SheetStylesMAxHeight90)}
				side={isDesktop ? "right" : "bottom"}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 text-primary">
							<UIText variant={'heading'}>{t('addEvent')}</UIText>
						</div>
					</div>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<Formik
							initialValues={{
								name: "",
								date: "",
								venue: "",
								details: "",
								teamId:"",
							}}
							validationSchema={AddEventSchema}
							onSubmit={(values) => {
								onAdd(values);
							}}
						>
							{({values, errors, touched, handleChange, handleBlur}) => (
								<Form className="flex flex-col w-full space-y-6">

									<div className="flex flex-col">
										<Label className={"relative text-sm flex items-center justify-between gap-4"}>
											<UIText variant={'label'} className="shrink-0">{t('labelShareWithGroup')}</UIText>
										</Label>
										<div className={'flex gap-4 items-center relative'}>
											<Select onValueChange={(selected)=> setSelectedGroup(selected)} key={selectedGroup}>
												<SelectTrigger ref={null} className="w-full h-12 flex between rtl:flex-row-reverse">
													<UIText variant={'label'}>{selectedGroup ? userOwnedGroups.find((group)=> group.$id=== selectedGroup)?.name : <span className={'text-muted-foreground'}>{t('selectGroupPlaceholder')}</span>}</UIText>
												</SelectTrigger>
												<SelectContent>
													{userOwnedGroups.length===0 &&
														<SelectItem
															value={null}
														>
															<UIText className={'text-muted-foreground'} variant={'sm'}>{t('groupNotFound')}</UIText>
														</SelectItem>
													}
													{userOwnedGroups?.map((u)=>(
														<SelectItem
															key={u.$id}
															value={u.$id}
														>
															<UIText variant={'sm'}>{u.name}</UIText>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{selectedGroup &&
												<Button
													variant={'ghost'}
													type={'button'}
													size={'icon'}
													onClick={()=> setSelectedGroup(null)}
													className={'flex items-center justify-center text-primary hover:text-primary absolute ltr:right-1 rtl:left-1 bg-white'}
												>
													<XIcon className={'w-4 h-4'} />
												</Button>
											}
										</div>
									</div>

									<div className="flex flex-col">
										<FormLabel
											title={t('labelName')}
											errors={errors.name}
											touched={touched.name}
										/>
										<UIText isUrdu={isStringUrdu(values.name)}>
											<Input
												onChange={handleChange}
												onBlur={handleBlur}
												name="name"
												disabled={disabled}
											/>
										</UIText>
									</div>

									<div
										className={'flex items-center justify-center gap-1 cursor-pointer text-primary'}
										onClick={()=> setAddEventDetails(!addEventDetails)}
									>
										{addEventDetails ? <XIcon className={'w-4 h-4'}/> : <Plus className={'w-4 h-4'}/>}
										<UIText variant={'sm'} className={'font-medium'}>{t('addMoreDetailsText')}</UIText>
									</div>

									{addEventDetails &&
										<>
											<div className="flex flex-col">
												<FormLabel
													title={t('labelDate')}
													errors={errors.date}
													touched={touched.date}
												/>
												<Input
													onChange={handleChange}
													onBlur={handleBlur}
													name="date"
													disabled={disabled}
												/>
											</div>
											<div className="flex flex-col">
												<FormLabel
													title={t('labelVenue')}
													errors={errors.venue}
													touched={touched.venue}
												/>
												<UIText isUrdu={isStringUrdu(values.venue)}>
													<Input
														onChange={handleChange}
														onBlur={handleBlur}
														name="venue"
														disabled={disabled}
													/>
												</UIText>
											</div>
											<div className="flex flex-col">
												<FormLabel
													title={t('labelDetails')}
													errors={errors.details}
													touched={touched.details}
												/>
												<UIText isUrdu={isStringUrdu(values.details)}>
													<Textarea
														onChange={handleChange}
														onBlur={handleBlur}
														name="details"
														disabled={disabled}
													/>
												</UIText>
											</div>
										</>
									}

									<UISheetFooter
										adding={adding}
										disabled={disabled}
										onOpenChange={onOpenChange}
										labelAction={t('btnSaveEntry')}
										labelCancel={t('btnCancel')}
									/>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
