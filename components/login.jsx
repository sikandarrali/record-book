"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useAuth } from "./contexts/AuthContext";
import FormLabel from "./theme/FormLabel";

const LoginSchema = Yup.object().shape({
	password: Yup.string().required("Required"),
	email: Yup.string().email("Invalid email format").required("Required"),
});

const Login = (second) => {
	const [showPassword, setShowPassword] = useState(false);

	const { login, user, logout, setLoading } = useAuth();

	const onLogin = async (values) => {
		// console.log(values);

		await login(values.email, values.password);
	};

	useEffect(() => {
		setLoading(false);
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-primary">
					Login to your account
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5">
				<Formik
					initialValues={{
						email: "sikandar.chishty@gmail.com",
						password: "qwerty@123",
					}}
					validationSchema={LoginSchema}
					onSubmit={(values) => {
						onLogin(values);
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
									title="email"
									errors={errors.email}
									touched={touched.email}
								/>
								<Input
									onChange={handleChange}
									onBlur={handleBlur}
									name="email"
									value="sikandar.chishty@gmail.com"
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
									value="qwerty@123"
									className="pr-10"
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

							<Button className="w-full" size="2xl" stretched>
								Login
							</Button>

							<Link
								href={"forgot-password"}
								className="font-semibold text-sm mt-6 ml-auto text-primary"
							>
								Forgot Password?
							</Link>
						</Form>
					)}
				</Formik>
			</CardContent>

			<br />
			<Button className="w-full" size="2xl" stretched onClick={logout}>
				Logout
			</Button>
			<br />
			<br />
		</Card>
	);
};

export default Login;
