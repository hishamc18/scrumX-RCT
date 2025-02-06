"use client";
import React, { useState, useEffect } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "@/components/InputField";
import { IoChevronBackSharp } from "react-icons/io5";

function MyProfile({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
    setTimeout(() => {
            setShouldRender(false)
    }, 700);
    }
  }, [isOpen]);

  if (!shouldRender) return null;
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        profession: "",
        password: "",
        newpassword: "",
      }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("First Name is required"),

        lastName: Yup.string().required("Last Name is required"),
        profession: Yup.string().required("Profession is required"),
        password: Yup.string().required("Current password is required"),
        newpassword: Yup.string().required("New password is required"),
      })}
      onSubmit={(values) => {
        console.log("Form Submitted:", values);
      }}
    >
      {({ handleSubmit }) => (
        <Form
          className={`fixed z-10 top-[82px] left-[220px] w-[534px] h-[calc(100vh-82px)] p-5 px-[50px] bg-offWhite shadow-[0px_4px_10px_rgba(0,0,0,0.25)] 
        ${isOpen ? "animate-slideIn" : "animate-slideOut"}
      `}
        >
          <div className="flex items-center space-x-3 justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-black">My Account</h2>
              <p className="text-placeholder mt-1 flex items-center ">
                <FaEnvelopeOpenText className="text-black mr-2 text-[12px]" />
                <span className="text-[12px]"> cristianoronaldo@gmail.com</span>
              </p>
            </div>

            <div className="flex px-10">
              <img
                src="/images/Trendy Person Avatar.png"
                alt="cristiano ronaldo"
                className="w-[93px] h-[89px] rounded-full border border-[#969797]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <label className="text-[12px] text-black font-poppins ">
                First Name
              </label>
              <span className="text-placeholder text-[11px] ">
                Enter the first part of your name
              </span>
            </div>
            <div>
              <InputField
                name="firstName"
                id="firstName"
                type="text"
                className="mt-3 w-[190px] h-[28px] rounded-[10px] "
              />
              <ErrorMessage name=" first Name" className=""/>
            </div>
          </div>

          <div className="flex items-center  justify-between -mt-2">
            <div className="flex flex-col">
              <label className="text-[12px] text-black  font-poppins">
                Last Name
              </label>
              <span className=" text-placeholder text-[11px] ">
                Enter the last part of your name
              </span>
            </div>
            <div>
              <InputField
                name="lastName"
                id="lastName"
                type="text"
                className="mt-3 w-[190px] h-[28px] rounded-[10px]"
              />
              <ErrorMessage name=" last Name" />
            </div>
          </div>

          <div className="flex items-center justify-between -mt-2">
            <div className="flex flex-col">
              <label className="text-[12px] text-black  font-poppins">
                Profession
              </label>
              <span className=" text-placeholder text-[11px] ">
                Enter your Profession
              </span>
            </div>
            <div>
              <InputField
                name="profession"
                id="profession"
                type="text"
                className="mt-3 w-[190px] h-[28px] rounded-[10px]"
              />
              <ErrorMessage name="profe" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              // onClick={handleSubmit}
              className="px-2 py-1 bg-[#0094FF] text-pureWhite rounded-[10px] hover:bg-blue-600 font-semibold text-[11px]"
            >
              Update
            </button>
          </div>

          <div className="flex absolute -right-5 justify-end">
            <div
              className="w-[40px] h-[40px] bg-offWhite  shadow-[0px_4px_10px_rgba(0,0,0,0.25)] flex items-center justify-center rounded-full"
              onClick={onClose}
            >
              <IoChevronBackSharp className="text-textColor " />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <label className="text-[12px] text-black  font-poppins">
                Change Password
              </label>
              <span className=" text-placeholder text-[11px] ">
                You can change your password for security reasons
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex flex-col">
              <label className="text-[12px] text-black font-poppins">
                Current Password
              </label>
              <span className=" text-placeholder text-[11px] ">
                Enter your current password
              </span>
            </div>
            <div>
              <InputField
                name="password"
                id="password"
                type="text"
                className="mt-3 w-[190px] h-[28px] rounded-[10px]"
              />
              <ErrorMessage name="pass" />
            </div>
          </div>

          <div className="flex items-center justify-between -mt-2">
            <div className="flex flex-col">
              <label className="text-[12px] text-black  font-poppins">
                New Password
              </label>
              <span className=" text-placeholder text-[11px] ">
                Enter your new password
              </span>
            </div>
            <div>
              <InputField
                name="newpassword"
                id="newpassword"
                type="text"
                className="mt-3 w-[190px] h-[28px] rounded-[10px]"
              />
              <ErrorMessage name="newpass" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              // onClick={handleSubmit}
              className="mt-2 px-2 py-1 bg-[#0094FF] text-pureWhite rounded-[10px] hover:bg-blue-600 font-semibold text-[11px]"
            >
              Update
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default MyProfile;