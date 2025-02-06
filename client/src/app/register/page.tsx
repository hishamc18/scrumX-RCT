"use client";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Formik, Form,} from "formik";
import * as Yup from "yup";
import LoginInputField from "@/components/LoginInputField";
import Image from "next/image";
export default function register() {
    return (
        <>
            <div className=" flex flex-col justify-center items-center h-full w-full bg-white pb-14 xl-custom:w-[100%]">
                <Image src="/logo.png" width={200} height={200} priority alt="scrumX" />

                {/* upper inidcate text */}
                <div className="flex flex-col gap-2 w-full justify-center items-center ">
                    <h2 className="text-textColor font-poppins font-regular text-l ">
                        <span className="font-bold">ScrumX</span>
                    </h2>
                    <p className="text-gray-500 font-poppins font-light text-normal text-center text-xs py-2">
                        Welcome to scrumX please enter your email
                    </p>
                </div>

                {/* Input Credentials and google OAuth */}
                <div className="flex flex-col gap-2  w-4/5">
                    <Formik
                        initialValues={{
                            email: "",
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string().email("Invalid email").required("Email is required"),
                        })}
                        onSubmit={(values) => {
                            console.log("Form submitted:", values);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="flex flex-col py-2 ">
                                <LoginInputField name="email" placeholder="Enter e-mail" id="email "></LoginInputField>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-sm bg-blue-500 text-white py-2 rounded-lg mt-3 hover:bg-blue-600 transition"
                                >
                                    {isSubmitting ? "Confirm & Continue" : "Confirm & Continue"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <div className="flex items-center w-full my-4 ">
                        <hr className="flex-grow border-t border-gray-300" />
                        <p className="mx-3 text-gray-500 text-xs font-medium">OR</p>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <GoogleSignInButton />
                </div>
            </div>
        </>
    );
}