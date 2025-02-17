// "use client";
// import React, { useState, useEffect } from "react";
// import { IoMdClose } from "react-icons/io";
// import InputField from "@/components/InputField";
// import { Field, ErrorMessage, Formik, Form } from "formik";
// import * as Yup from "yup";
// import Image from "next/image";

// import { useDispatch } from "react-redux";
// import { createProject } from "@/redux/features/projectSlice";


// // projecct 
// interface User {
//   email: string;
//   name: string;
//   profileImage: string;
// }

// //modal props
// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   isIndividual: boolean;
// }


// const imageOptions = [
//   "/Angry-Photoroom.png",
//   "/Credit-Card.jpg",
//   "/Hello-Photoroom.png",
//   "/Welcome-removebg-preview.png",
// ];

// const dummyUsers: User[] = [
//   {
//     email: "irshana@gmail.com",
//     name: "Irshana Ismail",
//     profileImage: "/images/Create_a_new_project.png",
//   },
//   {
//     email: "haneena@gmail.com",
//     name: "Haneena Ramees",
//     profileImage: "/images/Create_a_new_project.png",
//   },
//   {
//     email: "nifras@gmail.com",
//     name: "Mohammad Nifras",
//     profileImage: "/images/Create_a_new_project.png",
//   },
//   {
//     email: "hisham@gmail.com",
//     name: "Hisham Muhammad",
//     profileImage: "/images/Create_a_new_project.png",
//   },
//   {
//     email: "shefeeq@gmail.com",
//     name: "Mohammad Shefeeq",
//     profileImage: "/images/Create_a_new_project.png",
//   },
// ];

// const AddProject: React.FC<ModalProps> = ({ isOpen, onClose, isIndividual }) => {
//   const dispatch = useDispatch();
//   const [isGroup, setIsGroup] = useState<boolean>(() => !isIndividual);
//   const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
//   const [email, setEmail] = useState<string>("");
//   const [selectedImage, setSelectedImage] = useState<string>(imageOptions[0]);


//   useEffect(() => {
//     setIsGroup(!isIndividual);
//   }, [isIndividual]);

  
//   if (!isOpen) return null;

//   const initialValues = {
//     name: "",
//     description: "",
//     image: imageOptions[0], 
//   };
  

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Name is required"),
//     description: Yup.string().required("Description is required"),
//   });

//   const handleSubmit = async(values: typeof initialValues) => {

//     if(isGroup && invitedUsers.length==0){
//       alert("in group project atleast one member is wanted")
//       return
//     }
//     console.log("Form Submitted", { ...values, invitedMembers:invitedUsers,isGroup });
//     const projectData = { ...values, invitedMembers: invitedUsers, isGroup };

//     // Dispatch the action to the Redux store
//     dispatch(createProject(projectData));
//     onClose();
//     setInvitedUsers([]) 
//      // Reset errors on close
//   };

//   //invite user with email this return array ,contain all invited users's email
//   const handleDone = () => {
//     if (!email.trim()) {
//       alert("Enter an email address.");
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       alert("Enter a valid email address.");
//       return;
//     }
//     if (invitedUsers.includes(email)) {
//       alert("Email already exists.");
//       return;
//     }
    
//     setInvitedUsers((prevUsers) => [...prevUsers, email]);
//     setEmail("");
//   };
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
//       <div className="bg-pureWhite w-[400px] p-4 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
//         <div className="flex justify-between items-center mb-3">
//           <h2 className="text-lg font-semibold text-primaryDark">Plant the First Step</h2>
//           <button className="text-primaryDark hover:text-gray-800" onClick={onClose}>
//             <IoMdClose size={18} />
//           </button>
//         </div>
//         <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
//         {({ setFieldValue }) => (
//             <Form className="flex flex-col px-4 space-y-1">

//             {/* Enter the name */}
//                <div className="flex flex-row justify-between gap-2 pt-3" >
//                 <label htmlFor="name" className="text-sm text-primaryDark">Name</label>
//                 <InputField id="name" name="name" placeholder="Title Your Masterpiece" className="w-[280px] h-[28px]" />
             
               
//               </div>

//               {/* enter the description */}
//               <div>
//                 <label htmlFor="description" className="text-sm text-primaryDark">Description</label>
//                 <Field
//                   as="textarea"
//                   name="description"
//                   id="description"
//                   placeholder="Describe your project..."
//                   className="border text-sm border-primaryDark bg-offWhite mt-2 px-3 py-2 rounded-xl w-full text-primaryDark placeholder-placeholder focus:outline-none min-h-[80px]"
//                 />
//                <ErrorMessage name="description" component="div" className="text-red-700 text-sm mt-1" />
//               </div>
//             {/* select image from in 5 specific image */}
//               {/* Image Selection */}
//               <div className="mb-2">
//                 <label className="text-sm text-gray-900">Select an Image</label>
//                 <div className="flex mt-1 justify-between space-x-2 overflow-x-auto scrollbar-none" >
//                   {imageOptions.map((image, index) => (
//                     <div
//                       key={index}
//                       className={`w-16 h-16 p-1 border-2 cursor-pointer rounded-lg ${
//                         selectedImage === image ? "border-primaryDark" : "border-gray-300"
//                       }`}
//                       onClick={() => {
//                         setSelectedImage(image);
//                         setFieldValue("image", image);
//                       }}
//                     >
//                       <Image src={image} alt={`Image ${index + 1}`} width={50} height={50} className="rounded-md" />
//                     </div>
//                   ))}
//                 </div>
//                  <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
//               </div>

//               {/* group or individual */}
//               <div className="flex relative justify-end gap-2 py-3 ">
    // <button
    //   type="button"
    //   className={`w-32 absolute right-28 px-4 py-2 rounded-xl transition-all text-sm mt-2 ${
    //     !isGroup ? "bg-primaryDark text-white" : "bg-lightDark text-black"
    //   }`}
    //   onClick={() => setIsGroup(false)}
    // >
    //   Individual
    // </button>
    // <button
    //   type="button"
    //   className={`w-32 px-4 py-2 rounded-xl transition-all text-sm mt-2 ${
    //     isGroup ? "bg-primaryDark text-white z-10" : "bg-lightDark text-black"
    //   }`}
    //   onClick={() => setIsGroup(true)}
    // >
    //   Group
    // </button>
//   </div>

//               {/* enter email part */}
//               {isGroup && (
//                 <div className="mt-3">
//                   <label htmlFor="email" className="text-sm text-primaryDark">Invite User</label>
//                   <div className="flex mt-1 gap-2">
//                     <input
//                       id="email"
//                       name="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Enter email to invite"
//                       className="border border-primaryDark bg-offWhite text-sm px-3 py-1 rounded-xl w-full text-primaryDark placeholder-placeholder focus:outline-none h-[28px]"
//                     />
//                     <button
//                       type="button"
//                       onClick={handleDone}
//                       className="flex justify-center items-center w-24 bg-primaryDark text-white text-sm  rounded-xl hover:bg-opacity-90 h-[28px]"
//                     >
//                       Done
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* invited user list */}
//               {isGroup && invitedUsers.length > 0 && (
//                 <div className="mt-3  h-32 overflow-y-auto scrollbar-none ">
//                   {invitedUsers.map((email, index) => {
//                     const user = dummyUsers.find((user) => user.email === email);
//                     return (
//                       <div key={index} className="flex gap-3 p-2 rounded-md">
//                         <Image
//                           src={user ? user.profileImage : "/images/Create_a_new_project.png"}
//                           alt={user ? user.name : "Unknown User"}
//                           width={30}
//                           height={30}
//                           className="rounded-full"
//                         />
//                         <div>
//                           <p className="font-medium">{user ? user.name : "User"}</p>
//                           <p className="text-sm text-gray-500">{email}</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* invite button */}
//               <div className="flex justify-center py-5">
//                 <button type="submit" className="flex justify-center items-center w-1/3 text-sm bg-lightBlue text-white rounded-xl hover:bg-opacity-90 h-[28px]">
//                   Invite
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default AddProject;
"use client";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { clearInvitedUser, createIndividualProject, createProject } from "@/redux/features/projectSlice";
import ProjectForm from "./ProjectForm";
import GroupSelection from "./GroupSelection";
import InviteUsers from "./InviteUsers";
import {  useSelector } from "react-redux";
import {  AppDispatch, RootState } from "@/redux/app/store";
interface ModalProps {
  isOpen: boolean;
  isIndividual: boolean;
  onClose: () => void;
  onDispatch: () => void;
}

const AddProject: React.FC<ModalProps> = ({ isOpen, onClose,onDispatch, isIndividual }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isGroup, setIsGroup] = useState<boolean>(() => !isIndividual);
  const invitedUserData = useSelector((state: RootState) => state.project.invitedUser);
  useEffect(() => {
    setIsGroup(!isIndividual);
  }, [isIndividual]);

  if (!isOpen) return null;

  const initialValues = { name: "", description: "", image: "/Angry-Photoroom.png" };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleDone = async(values: typeof initialValues) => {
    console.log({ ...values, invitedMembers: invitedUserData, isGroup })
    if (isGroup && invitedUserData.length === 0) {
      alert("In a group project, at least one member is required.");
      return;
    }
    const projectData = { ...values, invitedMembers: invitedUserData.map(user => user?.email?.trim()), isGroup };
    console.log(projectData)
    onClose();
    if(isGroup){
      console.log("this worked")
      await dispatch(createProject(projectData));
    }
   else{
    await dispatch(createIndividualProject(projectData));
   }
    onDispatch()
    dispatch(clearInvitedUser([]))
    // setInvitedUsers([]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
        <div className="bg-pureWhite w-[400px] p-4 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-primaryDark">Plant the First Step</h2>
          <button className="text-primaryDark hover:text-gray-800" onClick={onClose}>
            <IoMdClose size={18} />
          </button>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleDone}>
          {({ setFieldValue }) => (
            <Form className="flex flex-col px-4 space-y-1">
              <ProjectForm setFieldValue={setFieldValue} />
              <GroupSelection isGroup={isGroup} setIsGroup={setIsGroup} />
              {isGroup && <InviteUsers  />}
              <div className="flex justify-center py-5">
                <button type="submit" className="flex justify-center items-center w-1/3 text-sm bg-lightBlue text-white rounded-xl hover:bg-opacity-90 h-[28px]">
                  Done
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProject;
