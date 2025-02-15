"use client";
import React, { useState, useEffect } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "@/components/InputField";
import { IoChevronBackSharp } from "react-icons/io5";
import {
  getNewUserData,
  updateUserPassword,
  updateUserProfile,
  compareUserPassword,
} from "@/redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";

function MyProfile({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);


  useEffect(() => {
    dispatch(getNewUserData());
  }, [dispatch]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      setTimeout(() => {
        setShouldRender(false);
      }, 700);
    }
  }, [isOpen]);

  const profileValidationSchema = Yup.object({
    firstName: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    profession: Yup.string().required("Profession is required"),
  });

  const passwordValidationSchema = Yup.object({
    password: Yup.string().required("Current password is required"),
    newpassword: Yup.string().required("New password is required"),
  });

  const handleProfileSubmit = (values: FormValues) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key as keyof typeof values]);
    });

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    try {
      dispatch(updateUserProfile(formData))
        .unwrap()
        .then((res) => {
          dispatch(getNewUserData());
        });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handlePasswordSubmit = (values: {
    password: string;
    newpassword: string;
  }) => {
    try {
      dispatch(
        updateUserPassword({
          currentPassword: values.password,
          newPassword: values.newpassword,
        })
      )
        .unwrap()
        .then((res) => {
          console.log(res);
          alert(res);
          dispatch(getNewUserData());
          setShowNewPasswordInput(false);
        });
    } catch (error) {
      console.error("Password update failed:", error);
    }
  };

  const handleComparePassword = async (values: { password: string }) => {
    console.log(values);
    try {
      const response = await dispatch(
        compareUserPassword({ currentPassword: values.password })
      ).unwrap();

      console.log(response, "compare pleass");
      if (response?.message) {
        setShowNewPasswordInput(true);
      }
    } catch (error) {
      console.log(error, "compare");
    }
  };

  interface FormValues {
    firstName: string;
    lastName: string;
    profession: string;
    avatar: File | null | string;
    password: string;
    newpassword: string;
  }

  if (!shouldRender) return null;
  return (
    <Formik<FormValues>
      initialValues={{
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        profession: user?.userProfession || "",
        avatar: null,
        password: "",
        newpassword: "",
      }}
      validationSchema={profileValidationSchema}
      onSubmit={(values) => {
        handleProfileSubmit(values);
        if (values.password && values.newpassword) {
          passwordValidationSchema
            .validate(values)
            .then(() => {
              handlePasswordSubmit(values);
            })
            .catch((err) => console.error(err));
        }
      }}
    >
      {({ handleSubmit, values }) => (
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
                <span className="text-[12px]">{user?.email}</span>
              </p>
            </div>

            <div className="flex px-10">
              <label className="cursor-pointer relative">
                <img
                  src={user?.avatar ? user.avatar : "/Avatar.png"}
                  alt="userAvatar"
                  className="w-[93px] h-[89px] rounded-full border border-[#969797]"
                />

                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="hidden "
                  onChange={handleImageChange}
                />
              </label>
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
              <ErrorMessage name=" first Name" className="" />
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
              onClick={(e) => {
                e.preventDefault();
                handleProfileSubmit(values);
              }}
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

          {showNewPasswordInput && (
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
          )}

          <div className="flex justify-end">
            {!showNewPasswordInput ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleComparePassword(values);
                }}
                className="mt-2 px-2 py-1 bg-[#0094FF] text-pureWhite rounded-[10px] hover:bg-blue-600 font-semibold text-[11px]"
              >
                Done
              </button>
            ) : (
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handlePasswordSubmit(values);
                }}
                className="mt-2 px-2 py-1 bg-[#0094FF] text-pureWhite rounded-[10px] hover:bg-blue-600 font-semibold text-[11px]"
              >
                Update
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default MyProfile;
