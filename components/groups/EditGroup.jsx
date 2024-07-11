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
import {teams} from "@/components/appwrite/appwrite";
import {ID} from "appwrite";

const EditGroupSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(300, "max 50 characters")
        .required("required"),
});

export const EditGroup = ({ open, onOpenChange, data, setGroupName, setRefresh }) => {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1024px)",
    });

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
            toast.info("Nothing to update", ToastOptions);
            setAdding(false);
            setDisabled(false);
            return;
        }

        try {
            await teams.updateName(data.$id, values.name);
            toast.success("Group Name Updated", ToastOptions);
            setGroupName(values.name);
            setAdding(false);
            setRefresh(prev=> !prev);
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
            >
                <div className={'hidden'}><SheetHeader><SheetTitle/><SheetDescription/></SheetHeader></div>
                <div className="flex flex-col w-full min-h-full pt-4 justify-start">
                    {/* Date & Close */}
                    <div className="flex items-center space-x-2 justify-between mb-4">
                        <div className="flex items-center text-xl pt-2 space-x-2 font-semibold text-primary">
                            Edit Group
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
                                  handleSubmit,
                                  setFieldValue,
                              }) => (
                                <Form className="flex flex-col w-full space-y-6">
                                    <div className="flex flex-col">
                                        <FormLabel
                                            title="Group Name"
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
                                            "Save changes"
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
