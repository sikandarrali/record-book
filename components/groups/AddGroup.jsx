"use client";
import { db } from "@/components/appwrite/database";
import FormLabel from "@/components/theme/FormLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {cn, scrollToTop} from "@/lib/utils";
import { Form, Formik } from "formik";
import { Loader2Icon, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {teams} from "@/components/appwrite/appwrite";
import {ID} from "appwrite";
import {useAuth} from "@/components/contexts/AuthContext";
import {useData} from "@/components/contexts/DataContext";
import {useRouter} from "next/navigation";

const AddGroupSchema = Yup.object().shape({
    name: Yup.string()
        .min(1)
        .max(300, "max 50 characters")
        .required("required"),
});

export const AddGroup = ({ open, onOpenChange }) => {
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const {user} = useAuth()
    const {userGroups, setUserGroups} = useData()
    const router = useRouter()


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
            onOpenChange(false);
            toast.success("Group created", ToastOptions);
            setAdding(false);
            setDisabled(false);
            setUserGroups(prev=> [...prev, response])

            // refetchs Teams since there's no realtime channel to get team updates
            setTimeout(()=>{
                window.location.reload();
            }, 1500)

        } catch (error) {
            toast.error(`Unable to Add: ${error}`, ToastOptions);
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
                            Create Group
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
                            }}
                            validationSchema={AddGroupSchema}
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
                                    <div className="flex flex-col gap-2">
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
                                            "Create Group"
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
