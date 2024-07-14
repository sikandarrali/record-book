"use client";
import FormLabel from "@/components/theme/FormLabel";
import { Input } from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {cn} from "@/lib/utils";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {teams} from "@/components/appwrite/appwrite";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useTranslations} from "next-intl";

const EditGroupSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(300, "max 50 characters")
        .required("required"),
});

export const EditGroup = ({ open, onOpenChange, data, userGroups, setUserGroups}) => {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1024px)",
    });
    const t = useTranslations('groups')

    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const onUpdate = async (values) => {
        setAdding(true);
        setDisabled(true);

        if (
            values.name === data.name &&
            values.date === data.date &&
            values.venue === data.venue &&
            values.details === data.details
        ) {
            toast.info(t('alertNothingToUpdate'), ToastOptions);
            setAdding(false);
            setDisabled(false);
            return;
        }

        try {
            await teams.updateName(data.$id, values.name);
            toast.success(t('alertGroupUpdated'), ToastOptions);

            const tempGroups = userGroups.map((g)=>{
                if(g.$id=== data.$id){
                    return{...g, name:values.name}
                }else{
                    return {...g}
                }
            })
            setUserGroups(tempGroups);

            setAdding(false);
            setDisabled(false);
        } catch (error) {
            toast.error(t('alertException'), ToastOptions);
            setAdding(false);
            setDisabled(false);
        }
        onOpenChange(false);
    };

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
                            {t('editGroup')}
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
                        <Formik
                            initialValues={{
                                name: data.name,
                            }}
                            validationSchema={EditGroupSchema}
                            onSubmit={(values) => {
                                onUpdate(values);
                            }}
                        >
                            {({
                                  errors,
                                  touched,
                                  values,
                                  handleChange,
                                  handleBlur,
                              }) => (
                                <Form className="flex flex-col w-full space-y-6">
                                    <div className="flex flex-col">
                                        <FormLabel
                                            title={t('labelGroupName')}
                                            errors={errors.name}
                                            touched={touched.name}
                                        />
                                        <Input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="name"
                                            disabled={disabled}
                                            value={values.name}
                                        />
                                    </div>

                                    <UISheetFooter
                                        adding={adding}
                                        disabled={disabled}
                                        onOpenChange={onOpenChange}
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
