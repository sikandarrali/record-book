"use client";
import FormLabel from "@/components/theme/FormLabel";
import { Input } from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {cn} from "@/lib/utils";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {teams} from "@/components/appwrite/appwrite";
import {ID} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import {isStringUrdu} from "@/lib/isStringUrdu";

const AddGroupSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(300, "max 50 characters")
        .required("required"),
});

export const AddGroup = ({ open, onOpenChange, setRefresh }) => {
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const {user} = useAuth()
    const t = useScopedI18n('groups')

    const onAdd = async (values) => {
        setAdding(true);
        setDisabled(true);

        try {
            const response = await teams.create(ID.unique(), values.name, ['member']);
            await teams.updatePrefs(
                response.$id,
                {
                    creatorEmail: user.email
                }
            );
            setRefresh(prev => !prev)
            onOpenChange(false);
            toast.success(t('alertGroupCreated'), ToastOptions);
            setAdding(false);
            setDisabled(false);
        } catch (error) {
            toast.error(t('alertException'), ToastOptions);
            setAdding(false);
            setDisabled(false);
        }
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
                            <UIText>{t('createGroup')}</UIText>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
                        <Formik
                            initialValues={{
                                name: "",
                            }}
                            validationSchema={AddGroupSchema}
                            onSubmit={(values) => {
                                onAdd(values);
                            }}
                        >
                            {({
                                  errors,
                                  touched,
                                  handleChange,
                                  handleBlur,
                                  values
                              }) => (
                                <Form className="flex flex-col w-full space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <FormLabel
                                            title={t('labelGroupName')}
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

                                    <UISheetFooter
                                        adding={adding}
                                        disabled={disabled}
                                        onOpenChange={onOpenChange}
                                        labelAction={t('createGroup')}
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
