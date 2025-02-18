"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MdArrowRight } from "react-icons/md";
import MyProfile from "@/app/home/my_account/page";

// Sample project
const groupProjects = [{ projectName: "Chat App" }, { projectName: "Remote Collaboration" }];
const individualProjects = [{ projectName: "Portfolio Website" }, { projectName: "Task Manager" }];

const Sidebar = () => {
    const [openSections, setOpenSections] = useState<{ group: boolean; individual: boolean }>({
        group: false,
        individual: false,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch the active link from localStorage when the component mounts
    useEffect(() => {
        const storedActiveLink = sessionStorage.getItem("activeLink");
        if (storedActiveLink) {
            setActiveLink(storedActiveLink);
        }
    }, []);

    const [activeLink, setActiveLink] = useState<string>("/home");

    const toggleSection = (section: "group" | "individual") => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleLinkClick = (link: string) => {
        // Save the active link to localStorage
        sessionStorage.setItem("activeLink", link);
        setIsModalOpen(false);
        setActiveLink(link);
    };

    const handleAccountLinkClick = () => {
        setActiveLink(""); 
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="z-10 bg-pureWhite h-screen w-[214px] shadow-[2px_0px_10px_3px_rgba(0,0,0,0.11)] pt-[100px] fixed">
                <nav>
                    <ul className="space-y-4 pl-10 font-medium text-textColor font-poppins">
                        <li>
                            <Link
                                href="/home"
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    activeLink === "/home" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={() => handleLinkClick("/home")}
                            >
                                My Workplace
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/home/notes"
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    activeLink === "/home/notes" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={() => handleLinkClick("/home/notes")}
                            >
                                Notes
                            </Link>
                        </li>
                        <li>
                            <Link
                                href=""
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    activeLink === "" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={() => handleAccountLinkClick()}
                            >
                                My Account
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/home/trello"
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    activeLink === "/home/trello" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={() => handleLinkClick("/home/trello")}
                            >
                                Trello
                            </Link>
                        </li>
                    </ul>

                    {/* Projects Section */}
                    <div className="font-medium font-poppins mt-14 pl-10">
                        <p className="text-[13px] text-placeholder mb-2">Projects</p>

                        {/* Group Projects */}
                        <div>
                            <button onClick={() => toggleSection("group")} className="flex items-center w-full text-left">
                                <MdArrowRight
                                    className={`text-[#1C1B1F] w-[20px] h-[23px] transition-transform duration-300 ${
                                        openSections.group ? "rotate-90" : ""
                                    }`}
                                />
                                <span className="text-[12px] text-textColor ml-2">Group Projects</span>
                            </button>
                            {openSections.group && (
                                <ul className="pl-6 mt-1 space-y-1 text-[11px] text-textColor">
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
                                <span className="text-[12px] text-textColor ml-2">Individual Projects</span>
                            </button>

                            {openSections.individual && (
                                <ul className="pl-6 mt-1 space-y-1 text-[11px] text-textColor">
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
            <div className="absolute -z-10">
                <MyProfile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></MyProfile>
            </div>
        </>
    );
};

export default Sidebar;