"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {cn, scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import {Loader2Icon, X, XIcon} from "lucide-react";
import {useLayoutEffect, useState} from "react";
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
	SelectValue,
} from "@/components/ui/select"
import {listUserGroups} from "@/components/appwrite/appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {Label} from "@/components/ui/label";


const AddEventSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	date: Yup.string().min(1).max(300, "max 300 characters"),
	// .required("required"),
	venue: Yup.string().min(1).max(300, "max 300 characters"),
	details: Yup.string().min(1).max(300, "max 300 characters"),
});

export const AddEvent = ({ open, onOpenChange, refreshItems, setRefreshItems }) => {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [userGroups, setUserGroups] = useState([])
	const [selectedGroup, setSelectedGroup] = useState(null)
	const {user} = useAuth()

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
				await db.events.create(eventData);
			}

			onOpenChange(false);
			toast.success("Event created", ToastOptions);
			setAdding(false);
			setDisabled(false);
			scrollToTop()
		} catch (error) {
			toast.error(`Unable to Add: ${error}`, ToastOptions);
			setAdding(false);
			setDisabled(false);
		}
	};

	useLayoutEffect(() => {
		const unsub = async () =>{
			if(user){
				const response = await listUserGroups()
				if(response){
					let temp = response.teams.filter((item)=> item.prefs.creatorEmail === user.email)
					setUserGroups(temp)
				}else{
					setUserGroups([])
				}
			}
		}

		return ()=> unsub()
	}, []);

	return (
		<Sheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
			<SheetContent
				className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
				side={isDesktop ? "right" : "bottom"}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
				<div className="flex flex-col w-full min-h-full pt-4 justify-start">
					{/* Date & Close */}
					<div className="flex items-center space-x-2 justify-between mb-4">
						<div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
							Add New Event
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={() => onOpenChange(false)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
						<Formik
							initialValues={{
								name: "",
								date: "",
								venue: "",
								details: "",
							}}
							validationSchema={AddEventSchema}
							onSubmit={(values) => {
								onAdd(values);
							}}
						>
							{({
								errors,
								touched,
								values,
								handleChange,
								handleBlur,
								handleSubmit,
								setFieldValue,
							}) => (
								<Form className="flex flex-col w-full space-y-6">

									<div className="flex flex-col">
										<Label className={"relative text-sm flex items-center justify-between gap-4"}>
											<span className="shrink-0">Share with Group</span>
										</Label>
										<div className={'flex gap-4 items-center'}>
											<Select onValueChange={(selected)=> setSelectedGroup(selected)} key={selectedGroup}>
												<SelectTrigger className="w-full h-12 flex between">
													{selectedGroup ? userGroups.find((group)=> group.$id=== selectedGroup)?.name : 'Select Group'}
												</SelectTrigger>
												<SelectContent>
													{userGroups?.map((u)=>(
														<SelectItem
															key={u.$id}
															value={u.$id}
														>
															{u.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												variant={'ghost'}
												type={'button'}
												size={'icon'}
												onClick={()=> setSelectedGroup(null)}
												className={'flex items-center justify-center text-primary hover:text-primary'}
											>
												<XIcon className={'w-4 h-4'} />
											</Button>
										</div>
									</div>

									<div className="flex flex-col">
										<FormLabel
											title="Event Name"
											errors={errors.name}
											touched={touched.name}
										/>
										<Input
											onChange={handleChange}
											onBlur={handleBlur}
											name="name"
											disabled={disabled}
										/>
									</div>
									<div className="flex flex-col">
										<FormLabel
											title="Event Date"
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
											title="Venue"
											errors={errors.venue}
											touched={touched.venue}
										/>
										<Input
											onChange={handleChange}
											onBlur={handleBlur}
											name="venue"
											disabled={disabled}
										/>
									</div>
									<div className="flex flex-col">
										<FormLabel
											title="Detailes (if any)"
											errors={errors.details}
											touched={touched.details}
										/>
										<Textarea
											onChange={handleChange}
											onBlur={handleBlur}
											name="details"
											disabled={disabled}
										/>
									</div>

									<Button
										className="w-full"
										size="2xl"
										stretched
										disabled={disabled}
									>
										{adding ? (
											<>
												<Loader2Icon className="animate animate-spin w-5 h-5 stroke-[3]" />
											</>
										) : (
											"Save Entry"
										)}
									</Button>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
