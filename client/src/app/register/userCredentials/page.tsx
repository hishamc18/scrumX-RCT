
"use client";

import { AppDispatch, RootState } from "@/redux/app/store";
import { getNewUserData, updateUserData } from "@/redux/features/authSlice";
import LoginInputField from "@/components/LoginInputField";
import Image from "next/image";
import { Formik, Form, } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userValidationSchema from '@/schemas/userValidationSchema'



export default function UserCredentials() {
  const dispatch = useDispatch<AppDispatch>();

  // Local state to check if the user data has been fetched
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    dispatch(getNewUserData())
      .then(() => {
        setIsUserLoaded(true); // Set to true once user data is fetched
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        setIsUserLoaded(true); // Ensure form loads even in case of error
      });
  }, [dispatch]);

  // Get the user state from the Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user, "hello");

  // Show a loading message or spinner while user data is being fetched
  if (!isUserLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <div className="flex flex-col justify-center  items-center h-full pb-14 ">
       <Image src="/logo.png" width={200} height={200} priority alt="scrumX" />
                   
        {/* upper inidcate text */}
        <div className="flex flex-col  w-full justify-center items-center ">
                    <h2 className="text-textColor font-poppins font-regular text-l "><span className="font-bold">ScrumX</span></h2>
                    <div className="text-gray-500 font-poppins font-light text-normal text-center text-xs py-2 flex flex-col gap-1 ">
                    <p className="font-poppins font-semibold text-primaryDark ">{user?.email}</p>
                    <p>Finish setting up your account</p>
                    </div>
        </div>
        
        <div className="flex flex-col gap-2   w-4/5">
          <Formik
            initialValues={{
              firstName:  "", 
              lastName:  "",   
              password:"",
              userProfession:""

            }}
            validateOnChange={true}  // Validate fields on each change
            validateOnBlur={true}
            validationSchema={userValidationSchema}
            onSubmit={(values) => {
              const userData= { ...values, email: user?.email };
          
              console.log("Form submitted:", userData);
              if (user?.email) {
                dispatch(updateUserData(userData));
              } else {
                console.error("Email is missing, cannot update user data.");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col py-2">
          
          
                <LoginInputField name="firstName" type="text" id="firstName" placeholder="First Name" className=""/>
                <LoginInputField name="lastName" type="text" id="lastName" placeholder="Last Name" className=""/>
                <LoginInputField name="userProfession" type="text" id="userProfession" placeholder="Profession" className=""/>
                <LoginInputField name="password" type="password" id="password" placeholder="Enter your Password" className=""/>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-sm bg-blue-500 text-white py-2 rounded-lg mt-3 hover:bg-blue-600 transition"
                >
                  {isSubmitting ? "Register" : "Register"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}