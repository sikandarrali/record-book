import {Form, Formik} from "formik";
import FormLabel from "@/components/theme/FormLabel";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Asterisk, Loader2Icon, Plus} from "lucide-react";
import * as Yup from "yup";
import {useId, useState} from "react";
import {teams} from "@/components/appwrite/appwrite";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {cn, scrollToTop} from "@/lib/utils";
import {ParseErrorCodes} from "@/lib/parseErrorCodes";
import {useI18n, useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import {isStringUrdu} from "@/lib/isStringUrdu";


const AddMemberSchema = Yup.object().shape({
    email: Yup.string()
        .email('invalid')
        .required("required")
});


export const AddGroupMember = ({groupID, setUsersInGroup}) =>{
    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const t = useScopedI18n('groups')
    const tLabel = useScopedI18n('general.label')

    const onAdd = async (values) => {
        setAdding(true);
        setDisabled(true);

        try {
            const promise = await teams.createMembership(
                groupID, // team id
                ['member'], // roles
                values.email, // email
                undefined, // userId - optional
                undefined, // phone - optional
                process.env.NEXT_PUBLIC_CALLBACK_ADD_USER_TO_GROUP,
                undefined // name - optional
            );
            if(promise){
                toast.success(t('alertGroupMemberAdded'), ToastOptions);
                setAdding(false);
                setDisabled(false);
                setUsersInGroup(prev => [...prev, promise])
                scrollToTop()
            }
        } catch (error) {
            toast.error(ParseErrorCodes(t(error.response.type)), ToastOptions);
            setAdding(false);
            setDisabled(false);
        }
    };

    return(
        <Formik
            initialValues={{
                email: "",
            }}
            validationSchema={AddMemberSchema}
            onSubmit={(values, {resetForm}) => {
                onAdd(values);
                resetForm()
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
                <Form className="flex gap-4 w-full items-stretch justify-between" dir={'ltr'}>
                    <UIText isUrdu={isStringUrdu(values.email)} className={'flex-1 flex w-full'}>
                        {errors.email && touched.email &&
                            <span className={cn("absolute left-0 -top-7 flex items-center text-red-500 gap-1")}>
                                <Asterisk className="w-4 h-4 shrink-0" />
                                <span className={'text-base'}>
                                    {errors.email === 'invalid' && tLabel('invalid')}
                                    {errors.email === 'required' && tLabel('required')}
                                </span>
                            </span>
                        }
                        <Input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="email"
                            disabled={disabled}
                            placeholder={t('userEmailPlaceholder')}
                            value={values.email}
                            className={cn('normal-case rtl:text-left rtl:font-urdu', isStringUrdu(values.email) ? 'font-urdu' : 'rtl:font-sans')}
                        />
                    </UIText>

                    <Button
                        disabled={disabled}
                        type={'submit'}
                    >
                        {adding ? (
                            <Loader2Icon className="animate animate-spin w-5 h-5 stroke-[3]" />
                        ) : <UIText variant={'button    '}>{t('btnAddMember')}</UIText>
                        }
                    </Button>
                </Form>
            )}
        </Formik>
    )
}