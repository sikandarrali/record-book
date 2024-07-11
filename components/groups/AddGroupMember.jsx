import {Form, Formik} from "formik";
import FormLabel from "@/components/theme/FormLabel";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import * as Yup from "yup";
import {useState} from "react";
import {teams} from "@/components/appwrite/appwrite";
import {ID} from "appwrite";
import {toast} from "react-toastify";
import {ToastOptions} from "@/lib/ToastOptions";
import {scrollToTop} from "@/lib/utils";
import {useAuth} from "@/components/contexts/AuthContext";


const AddMemberSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid Email')
        .required("required")
});


export const AddGroupMember = ({groupID, setRefetchMembers}) =>{
    const [adding, setAdding] = useState(false);
    const [disabled, setDisabled] = useState(false);

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
                "http://localhost:3000/join-group",
                undefined // name - optional
            );
            if(promise){
                toast.success("User Added to Group", ToastOptions);
                setAdding(false);
                setDisabled(false);
                setRefetchMembers(prev=> !prev)
                scrollToTop()
            }
        } catch (error) {
            toast.error(`Unable to Add: ${error}`, ToastOptions);
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
                            placeholder={'User Email'}
                            value={values.email}
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
                            "Add"
                        )}
                    </Button>
                </Form>
            )}
        </Formik>
    )
}