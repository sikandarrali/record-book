"use client";
import FormLabel from "@/components/theme/FormLabel";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {cn, scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {account} from "@/components/appwrite/appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooter} from "@/components/theme/UISheetFooter";
import UIText from "@/components/theme/UIText";
import {useScopedI18n} from "@/locales/client";
import {UITextInput} from "@/components/theme/UITextInput";

const removeExtraSpaces = (value) => value.replace(/\s\s+/g, ' ').trim();

const EditGroupSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(100, "max 100 characters")
        .transform((value) => removeExtraSpaces(value))
        .required("required"),
});

export const EditProfile = ({ open, onOpenChange }) => {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1024px)",
    });

    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const {user, setUser} = useAuth()
    const t = useScopedI18n('settings.profile');

    const onUpdate = async (values) => {
        setAdding(true);
        setDisabled(true);

        if (values.name === user.name) {
            toast.info("Nothing to update", ToastOptions);
            setAdding(false);
            setDisabled(false);
            return;
        }

        try {
            await account.updateName(values.name.trim());
            toast.success("Name Updated", ToastOptions);
            setUser({...user, name:values.name});
            setAdding(false);
            setDisabled(false);
            scrollToTop()
        } catch (error) {
            toast.error(`Unable to Update: ${error}`, ToastOptions);
            setAdding(false);
            setDisabled(false);
        }
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <SheetContent
                className={cn("pb-40 lg:pb-14 overflow-auto max-h-fit")}
                side={isDesktop ? "right" : "bottom"}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
                <div className="flex flex-col w-full pt-4 justify-start">
                    {/* Date & Close */}
                    <div className="flex items-center space-x-2 justify-between mb-4">
                        <UIText variant={'heading'} className="text-primary" text={t('editProfile')}/>
                    </div>
                    <div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
                        <Formik
                            initialValues={{
                                name: user?.name,
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
                                  handleBlur
                              }) => (
                                <Form className="flex flex-col w-full space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <FormLabel
                                            title={t('name')}
                                            errors={errors.name}
                                            touched={touched.name}
                                        />
                                        <UITextInput
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
