"use client";
import FormLabel from "@/components/theme/FormLabel";
import {scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import { useState } from "react";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {account} from "@/components/appwrite/appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooterInForm} from "@/components/theme/UISheetFooterInForm";
import UIText from "@/components/theme/UIText";
import {useScopedI18n} from "@/locales/client";
import {UITextInput} from "@/components/theme/UITextInput";
import {ProfileSchema} from "@/lib/schemas/profileSchema";
import {UISheet} from "@/components/theme/UISheet";

export const EditProfile = ({ open, onOpenChange }) => {
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
        <UISheet open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <div className="flex flex-col flex-1 w-full pt-4 justify-start min-h-[200px]">
                {/* Date & Close */}
                <div className="flex items-center space-x-2 justify-between mb-4">
                    <UIText variant={'heading'} className="text-primary" text={t('editProfile')}/>
                </div>
                <div className="flex flex-col gap-5 w-full items-center justify-center py-6 lg:py-10">
                    <Formik
                        initialValues={{
                            name: user?.name,
                        }}
                        validationSchema={ProfileSchema}
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
                                <div className="flex flex-col gap-2 mb-8">
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

                                <UISheetFooterInForm
                                    adding={adding}
                                    disabled={disabled}
                                    onOpenChange={onOpenChange}
                                />
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </UISheet>
    );
};
