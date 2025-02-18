import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { getNewUserData } from "@/redux/features/authSlice";
import LougoutComponent from "@/components/Layout/LougoutComponent";
function Navbar() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isOpenLogout, setIsOpenLogout] = useState(false);
    const toggleLogout = () => setIsOpenLogout(!isOpenLogout);

    useEffect(() => {
        dispatch(getNewUserData());
    }, [dispatch]);

    return (
        <>
            <nav className="w-full h-[81px] bg-white flex items-center shadow-md justify-between px-4 sm:px-8">
                {/* Logo Section */}
                <div className="flex gap-2  sm:w-[600px] sm:justify-between">
                    <div className="flex items-center ">
                        <span className="text-gray-800 text-[22px] font-bold">ScrumX</span>
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-[170px] sm:w-[303px]">
                        <input
                            type="search"
                            placeholder="Search Projects"
                            className="w-full h-[33px] border border-gray-300 placeholder-gray-500 bg-gray-100 rounded-l-[10px] rounded-r-[20px] pl-4 pr-10 focus:outline-none focus:border-blue-500 text-primaryDark  "
                        />
                        <div className="w-[33px] h-[33px] rounded-full bg-textColor flex items-center justify-center absolute top-0 right-0 ">
                            <IoSearch className="text-white" aria-label="Search" />
                        </div>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="flex items-center space-x-2 relative">
                    <div className=" flex items-center">
                        <img
                            src={user?.avatar && user.avatar.trim() !== "" ? user.avatar : "/Avatar.png"}
                            alt="User Avatar"
                            className="rounded-full w-[50px] h-[50px]"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <div className="hidden lg:flex flex-col">
                        <span className="text-gray-800 flex items-center gap-1">
                            {`${user?.firstName} ${user?.lastName}`}
                            <FaChevronDown
                                className="text-gray-600 cursor-pointer ml-1 -mt-1 h-[11px] w-[11px]"
                                onClick={toggleLogout}
                            />
                        </span>
                        <small className="text-gray-600">{user?.userProfession}</small>
                    </div>
                </div>
            </nav>
            <div>
                <LougoutComponent isOpen={isOpenLogout} onClose={() => setIsOpenLogout(false)}></LougoutComponent>
            </div>
        </>
    );
}

export default Navbar;
