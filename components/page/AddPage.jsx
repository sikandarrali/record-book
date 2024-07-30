"use client";
import {scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import {ChevronDown, ChevronUp, Loader2Icon} from "lucide-react";
import {useState} from "react";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {ID, Permission, Role} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import UIText from "@/components/theme/UIText";
import {useI18n} from "@/locales/client";
import {COLLECTION_ID_PAGES, DATABASE_ID, databases} from "@/components/appwrite/appwrite";
import {PageSchema} from "@/lib/schemas/pageSchema";
import * as React from "react";
import {InputFieldWithLabel} from "@/components/theme/form/InputFieldWithLabel";
import {DatePickerWithLabel} from "@/components/theme/form/DatePickerWithLabel";
import {TextareaWithLabel} from "@/components/theme/form/TextareaWithLabel";
import {DropdownGroupSelectFieldWithLabel} from "@/components/theme/form/DropdownGroupSelectFieldWithLabel";
import {UISheet} from "@/components/theme/UISheet";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import {BookTypeToggleGroup} from "@/components/page/BookTypeToggleGroup";
import FormLabel from "@/components/theme/FormLabel";
import {SupportedCurrencies} from "@/lib/defaultData";
import {DropdownCurrencySelectFieldWithLabel} from "@/components/theme/form/DropdownCurrencySelectFieldWithLabel";

export const AddPage = ({ open, onOpenChange, userOwnedGroups }) => {

	const [adding, setAdding] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const {user} = useAuth()
	const [addEventDetails, setAddEventDetails] = useState(false)
	const t = useI18n()


	const onAdd = async (values) => {
		setAdding(true);
		setDisabled(true);

		let teamPermissions = [
			Permission.read(Role.team(values.teamId, "member")),
			Permission.update(Role.team(values.teamId, "member")),
			Permission.read(Role.user(user.$id)),
			Permission.update(Role.user(user.$id)),
			Permission.delete(Role.user(user.$id)),
		]
		let userPermissions = [
			Permission.read(Role.user(user.$id)),
			Permission.update(Role.user(user.$id)),
			Permission.delete(Role.user(user.$id)),
		]

		const tempCreatedBy = [user?.name, user?.email];

		try {
			const eventData = {
				name: values.name.trim(),
				date: values.date,
				type: values.type,
				details: values.details.trim(),
				teamId: values.teamId,
				createdBy: tempCreatedBy,
				updatedBy: [],
				currency: values.currency
			};

			if(values.teamId){
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_ID_PAGES,
					ID.unique(),
					eventData,
					teamPermissions
				);
				response.then(function (response) {
					toast.success(t("alerts.added"), ToastOptions);
				}, function (error) {
					toast.error(t('alerts.exception'), ToastOptions);
				});
			}else{
				const response = databases.createDocument(
					DATABASE_ID,
					COLLECTION_ID_PAGES,
					ID.unique(),
					eventData,
					userPermissions
				);
				response.then(function (response) {
					toast.success(t("alerts.added"), ToastOptions);
				}, function (error) {
					toast.error(t('alerts.exception'), ToastOptions);
				});
			}
			onOpenChange(false);
			setAdding(false);
			setDisabled(false);
			scrollToTop()
		} catch (error) {
			toast.error(t('alerts.exception'), ToastOptions);
			setAdding(false);
			setDisabled(false);
		} finally {
			setAdding(false)
			setDisabled(false)
		}
	};

	return (
		<UISheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<UIText
				variant={'heading'}
				className="text-primary mb-4"
				text={t('pages.home.add')}
			/>

			<div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
				<Formik
					initialValues={{
						name: "",
						date: "",
						details: "",
						type: "khaataBook",
						teamId: "",
						createdBy: "",
						updatedBy: "",
						currency: "pkr"
					}}
					validationSchema={PageSchema}
					onSubmit={(values) => {
						onAdd(values);
					}}
				>
					{({
						  values,
						  errors,
						  touched,
						  handleChange,
						  handleBlur,
						  setFieldValue
					  }) => (
						<Form className="flex flex-col w-full space-y-8">

							{/* Book Type */}
							<div className={'flex flex-col'}>
								<FormLabel title={t('labels.bookType')}/>
								<BookTypeToggleGroup value={values.type} setFieldValue={setFieldValue} />
							</div>

							{/* Select Group */}
							<DropdownGroupSelectFieldWithLabel
								label={t('labels.group')}
								data={userOwnedGroups}
								onSelect={(value)=> {
									setFieldValue('teamId', value)
								}}
								onClear={()=>{
									setFieldValue("teamId", "");
								}}
								isOwner={true}
								fieldValue={values.teamId}
							/>


							{/* Name */}
							<InputFieldWithLabel
								label={t('labels.name')}
								errors={errors.name}
								touched={touched.name}
								onChange={handleChange}
								onBlur={handleBlur}
								name="name"
								disabled={disabled}
							/>

							<div
								className={'flex items-center rtl:items-start justify-center gap-1.5 rtl:gap-3 cursor-pointer text-primary dark:text-foreground'}
								onClick={()=> setAddEventDetails(!addEventDetails)}
							>
								<UIText variant={'sm'} className={'font-medium'} text={t('labels.addMoreDetails')}/>
								{addEventDetails ? <ChevronUp className={'w-6 h-6 stroke-[3] rtl:mt-2 text-primary'}/> : <ChevronDown className={'w-6 h-6 stroke-[3] rtl:mt-2 text-primary'}/>}
							</div>

							{addEventDetails &&
								<>
									{/* Date */}
									<DatePickerWithLabel
										label={t('labels.date')}
										setFieldValue={setFieldValue}
										name={'date'}
										disabled={disabled}
										fieldValue={values.date}
										onClear={()=> setFieldValue('date', '')}
									/>

									{/* Currency */}
									<DropdownCurrencySelectFieldWithLabel
										label={t('labels.currency')}
										data={SupportedCurrencies}
										onSelect={(value)=> {
											setFieldValue('currency', value)
										}}
										onClear={()=>{
											setFieldValue("currency", "");
										}}
										fieldValue={values.currency}
									/>

									{/* Details */}
									<TextareaWithLabel
										label={t('labels.details')}
										errors={errors.details}
										touched={touched.details}
										onChange={handleChange}
										onBlur={handleBlur}
										name="details"
										disabled={disabled}
									/>
								</>
							}

							<div className={'mt-auto'}/>
							<UISheetFooterInForm
								adding={adding}
								disabled={disabled}
								onOpenChange={onOpenChange}
								labelAction={t('buttons.save')}
								labelCancel={t('buttons.cancel')}
							/>
						</Form>
					)}
				</Formik>
			</div>
		</UISheet>
	);
};

export default  AddPage