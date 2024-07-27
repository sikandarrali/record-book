import {Form, Formik} from "formik";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Asterisk, Loader2Icon, Plus} from "lucide-react";
import * as Yup from "yup";
import {useState} from "react";
import {teams} from "@/components/appwrite/appwrite";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {cn, scrollToTop} from "@/lib/utils";
import {ParseErrorCodes} from "@/lib/parseErrorCodes";
import {useScopedI18n} from "@/locales/client";
import UIText from "@/components/theme/UIText";
import {isStringUrdu} from "@/lib/isStringUrdu";
import {UITextInput} from "@/components/theme/UITextInput";


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
            toast.error(t(error.response.type), ToastOptions);
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
                    <div className={'flex-1 flex w-full relative'}>
                        {errors.email && touched.email &&
                            <div className={cn("absolute ltr:right-0 rtl:left-0 ltr:-top-6 rtl:-top-9 flex items-center text-red-500 gap-1")}>
                                <Asterisk className="w-4 h-4 shrink-0 rtl:mt-2" />
                                {errors.email === 'invalid' && <UIText variant={'sm'} text={tLabel('invalid')}/>}
                                {errors.email === 'required' && <UIText variant={'sm'} text={tLabel('required')}/>}
                            </div>
                        }
                        <UITextInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="email"
                            disabled={disabled}
                            placeholder={t('userEmailPlaceholder')}
                            value={values.email.trim()}
                            className={'lowercase ring-muted-foreground'}
                        />
                    </div>

                    <Button
                        disabled={disabled}
                        type={'submit'}
                        className={'flex-wrap items-center justify-center shrink-0'}
                    >
                        {adding ?
                            <Loader2Icon className="animate animate-spin w-6 h-6 stroke-[3]" />
                            :
                            <Plus className="w-6 h-6 stroke-[3]" />
                        }
                    </Button>
                </Form>
            )}
        </Formik>
    )
}