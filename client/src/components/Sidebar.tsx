"use client";
import Link from "next/link";
import React, { useState } from "react";
import { MdArrowRight } from "react-icons/md";

// Sample
const groupProjects = [
  { projectName: "Chat App" },
  { projectName: "Remote Collaboration" },
];

const individualProjects = [
  { projectName: "Portfolio Website" },
  { projectName: "Task Manager" },
];

export const Sidebar = () => {
  const [openSections, setOpenSections] = useState<{ group: boolean; individual: boolean }>({
    group: false,
    individual: false,
  });

  const toggleSection = (section: "group" | "individual") => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-pureWhite h-screen md:w-[214px] shadow-[2px_0px_10px_3px_rgba(0,0,0,0.11)] pt-[81px] fixed">
      <nav>
        <ul className="space-y-4 pl-10 font-medium text-textColor font-poppins">
          <li>
            <Link href="/home" className="py-2 text-[12px]">
              Main Menu
            </Link>
          </li>
          <li>
            <Link href="/home/dashboard" className="py-2 text-[12px]">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/home/myaccount" className="py-2 text-[12px]">
              My Account
            </Link>
          </li>
          <li>
            <Link href="/home/trello" className="py-2 text-[12px]">
              Trello
            </Link>
          </li>
        </ul>

        {/* Projects Section */}
        <div className="font-medium font-poppins mt-14 pl-10">
          <p className="text-[11px] text-placeholder mb-2">Projects</p>

          {/* Group Projects */}
          <div>
            <button
              onClick={() => toggleSection("group")}
              className="flex items-center w-full text-left"
            >
              <MdArrowRight
                className={`text-[#1C1B1F] w-[20px] h-[23px] transition-transform duration-300 ${
                  openSections.group ? "rotate-90" : ""
                }`}
              />
              <span className="text-[10px] text-textColor ml-2">Group Projects</span>
            </button>
            {openSections.group && (
              <ul className="pl-6 mt-1 space-y-1 text-[10px] text-textColor">
                {groupProjects.map((project, index) => (
                  <li key={index} className="pl-4 py-1">
                    {project.projectName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Individual Projects */}
          <div className="mt-2">
            <button
              onClick={() => toggleSection("individual")}
              className="flex items-center w-full text-left"
            >
              <MdArrowRight
                className={`text-[#1C1B1F] w-[20px] h-[23px] transition-transform duration-300 ${
                  openSections.individual ? "rotate-90" : ""
                }`}
              />
              <span className="text-[10px] text-textColor ml-2">Individual Projects</span>
            </button>

        
            {openSections.individual && (
              <ul className="pl-6 mt-1 space-y-1 text-[10px] text-textColor">
                {individualProjects.map((project, index) => (
                  <li key={index} className="pl-4 py-1">
                    {project.projectName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
