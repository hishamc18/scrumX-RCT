/* eslint-disable @next/next/no-img-element */
import { AppDispatch, RootState } from "@/redux/app/store";
import { getNewUserData } from "@/redux/features/authSlice";
import { checkInviteUser } from "@/redux/features/projectSlice";
import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const InviteUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUserEmail = useSelector((state: RootState) => state.auth?.user?.email); 
  useEffect(()=>{
    dispatch(getNewUserData())
  })
  console.log(loggedInUserEmail)
  const [email, setEmail] = useState<string>("");
  const invitedUserData = useSelector((state: RootState) => state.project.invitedUser);
  const handleAddInvite = () => {
    if (!email.trim()) {
            alert("Enter an email address.");
            return;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            alert("Enter a valid email address.");
            return;
          }
          if (invitedUserData.some(user => user.email === email.trim())) {
            alert("Email already exists.");
            return;
          }
          if (email.trim() === loggedInUserEmail) {
            alert("You cannot invite yourself.");
            return;
          }
    dispatch(checkInviteUser(email));
    setEmail("");
  };

  return (
    <div>
      <label className="font-semibold text-primaryDark">Invite via email</label>
      <div className="flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to invite"
          className="border-2 border-gray-300 bg-offWhite text-sm px-3 py-1 rounded-xl w-full text-primaryDark placeholder-placeholder focus:outline-none h-[28px]"
        />
        <button type="button" onClick={handleAddInvite} className="flex justify-center items-center w-24 bg-primaryDark text-white text-xs  rounded-xl hover:bg-opacity-90 h-[28px]">
        Add Inviter
        </button>
      </div>
      {invitedUserData.length > 0 && (
        <div className="mt-3 h-32 overflow-y-auto scrollbar-none">
          {invitedUserData.slice().reverse().map((user, index) => (         // reverse() is update in original reference, slice() creates a new array without modifying the original.
            <div key={index} className="flex gap-3 p-2 rounded-md">
              <img src={user.avatar} alt="user" width={42} height={5} className="rounded-full object-cover"/>
              <div>
                <p className="font-medium text-primaryDark">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InviteUsers;
