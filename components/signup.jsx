"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import { useAuth } from "./contexts/AuthContext";
import FormLabel from "./theme/FormLabel";

const SignupSchema = Yup.object().shape({
	name: Yup.string()
		.min(1)
		.max(300, "max 300 characters")
		.required("required"),
	password: Yup.string()
		.min(8, "min. 8 characters long")
		.matches(/[0-9]/, "min. 1 number")
		.matches(/[a-z]/, "min. 1 lowercase letter")
		// .matches(/[A-Z]/, "Password requires an uppercase letter")
		.matches(/[^\w]/, "password requires a symbol")
		.required("required"),
	confirmPassword: Yup.string().oneOf(
		[Yup.ref("password"), null],
		"passwords do not match"
	),
	email: Yup.string().email("invalid email format").required("required"),
});

const Signup = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { signup } = useAuth();

	const onSignup = async (values) => {
		// e.preventDefault();
		await signup(values.email, values.password, values.name);
		console.log(values);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-primary">
					Create new account
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5">
				<Formik
					initialValues={{
						name: "Sikandar",
						email: "msikkac@gmail.com",
						password: "12345asdf@",
						confirmPassword: "12345asdf@",
					}}
					validationSchema={SignupSchema}
					onSubmit={(values) => {
						onSignup(values);
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
									title="name"
									errors={errors.name}
									touched={touched.name}
								/>
								<Input
									onChange={handleChange}
									onBlur={handleBlur}
									name="name"
								/>
							</div>

							<div className="flex flex-col">
								<FormLabel
									title="email"
									errors={errors.email}
									touched={touched.email}
								/>
								<Input
									onChange={handleChange}
									onBlur={handleBlur}
									name="email"
								/>
							</div>

							<div className="flex flex-col relative">
								<FormLabel
									title="password"
									errors={errors.password}
									touched={touched.password}
								/>
								<Input
									onChange={handleChange}
									onBlur={handleBlur}
									name="password"
									type={showPassword ? "text" : "password"}
								/>
								<span
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="cursor-pointer absolute right-0 bottom-0 mb-4 mr-3.5"
								>
									{showPassword ? (
										<Eye className="text-primary w-4 h-4" />
									) : (
										<EyeOff className="w-4 h-4" />
									)}
								</span>
							</div>

							<div className="flex flex-col">
								<FormLabel
									title="confirm password"
									errors={errors.confirmPassword}
									touched={touched.confirmPassword}
								/>
								<Input
									onChange={handleChange}
									onBlur={handleBlur}
									name="confirmPassword"
									type={showPassword ? "text" : "password"}
								/>
							</div>

							<Button
								type="submit"
								onClick={handleSubmit}
								className="w-full"
								size="2xl"
								stretched
							>
								Create account
							</Button>
						</Form>
					)}
				</Formik>
			</CardContent>
			<CardFooter className="flex flex-col"></CardFooter>
		</Card>
	);
};

export default Signup;
