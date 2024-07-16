import {Form, Formik} from "formik";
import FormLabel from "@/components/theme/FormLabel";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import * as Yup from "yup";
import {useState} from "react";
import {teams} from "@/components/appwrite/appwrite";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {scrollToTop} from "@/lib/utils";
import {ParseErrorCodes} from "@/lib/parseErrorCodes";
import {useScopedI18n} from "@/locales/client";


const AddMemberSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid Email')
        .required("required")
});


export const AddGroupMember = ({groupID, setUsersInGroup}) =>{
    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const t = useScopedI18n('groups')

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
                <Form className="flex gap-4 items-stretch">
                    <div className="flex flex-col w-full">
                        <Input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="email"
                            disabled={disabled}
                            placeholder={t('userEmailPlaceholder')}
                            value={values.email}
                            className={'normal-case rtl:text-left'}
                        />
                        <span className={'mt-2 self-end'}>
                            <FormLabel
                                title=""
                                errors={errors.email}
                                touched={touched.email}
                            />
                        </span>
                    </div>

                    <Button
                        size="2xl"
                        disabled={disabled}
                        type={'submit'}
                    >
                        {adding ? (
                            <>
                                <Loader2Icon className="animate animate-spin w-5 h-5 stroke-[3]" />
                            </>
                        ) : (
                            t('btnAdd')
                        )}
                    </Button>
                </Form>
            )}
        </Formik>
    )
}