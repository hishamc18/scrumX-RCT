import React from "react";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import Image from "next/image";
function Navbar() {
  return (
    <>
      <nav className="w-full h-[81px] bg-white flex items-center shadow-md justify-between px-4 sm:px-8">
        {/* Logo Section */}
        <div className="flex items-center ">
          <span className="text-gray-800 text-xl font-bold">ScrumX</span>
        </div>

        {/* Search Bar */}
        <div className='relative w-full max-w-[303px]'>
          <input
            type="search"
            placeholder="Search Projects"
            className="w-full h-[33px] border border-gray-300 placeholder-gray-500 bg-gray-100 rounded-l-[10px] rounded-r-[20px] pl-4 pr-10 focus:outline-none focus:border-blue-500 text-primaryDark  "
          />

          <div className="w-[33px] h-[33px] rounded-full bg-textColor flex items-center justify-center absolute top-0 right-0 ">
            <IoSearch className="text-white" aria-label="Search" />
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-2">
          <div className=" flex items-center">
            <Image
              src="/images/Trendy Person Avatar.png"
              alt="User Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-gray-800 flex items-center gap-1">
              Cristiano Ronaldo
              <FaChevronDown className="text-gray-600" />
            </span>
            <small className="text-gray-600">Developer</small>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
