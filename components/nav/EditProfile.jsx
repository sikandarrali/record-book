"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {cn, scrollToTop} from "@/lib/utils";
import { useMyStore } from "@/store/store";
import { Form, Formik } from "formik";
import { Loader2Icon, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {ToastOptions} from "@/lib/ToastOptions";
import {toast} from "react-toastify";
import {account, teams} from "@/components/appwrite/appwrite";
import {ID} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {UISheetFooter} from "@/components/theme/UISheetFooter";

const EditGroupSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(100, "max 100 characters")
        .required("required"),
});

export const EditProfile = ({ open, onOpenChange }) => {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1024px)",
    });

    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const {user, setUser} = useAuth()

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
            await account.updateName(values.name);
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
                className={cn("pb-8 lg:pb-14 overflow-auto max-h-fit")}
                side={isDesktop ? "right" : "bottom"}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
                <div className="flex flex-col w-full min-h-full pt-4 justify-start">
                    {/* Date & Close */}
                    <div className="flex items-center space-x-2 justify-between mb-4">
                        <div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
                            Edit Profile
                        </div>
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
                                  handleBlur,
                                  handleSubmit,
                                  setFieldValue,
                              }) => (
                                <Form className="flex flex-col w-full space-y-6">
                                    <div className="flex flex-col">
                                        <FormLabel
                                            title="Name"
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
                                        labelAction={'Save Changes'}
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
