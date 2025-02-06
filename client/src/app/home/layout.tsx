"use client";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import ReduxProvider from "../../redux/ReduxProvider";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { SlArrowRight } from "react-icons/sl";
import "../../app/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar visibility

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState); // Toggle sidebar open/close
    };

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="h-screen flex flex-col">
                    {/* Navbar - Fixed at the Top */}
                    <div className="w-full fixed top-0 bg-white z-40 h-16 shadow-md">
                        <Navbar />
                    </div>

                    <div className="flex h-full">
                        {/* Sidebar - Fixed on the Left */}
                        <div
                            className={`z-30 bg-white shadow-md fixed h-full transition-transform duration-300 ${
                                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                            style={{ width: "212px" }}
                        >
                            <Sidebar />
                        </div>

                        {/* Main Content - Scrollable */}
                        <div
                            className={`z-10 transition-all duration-300 flex-1 pt-20 overflow-y-auto scrollbar-hidden ${
                                isSidebarOpen ? "ml-[210px]" : ""
                            }`}
                        >
                            <ReduxProvider>{children}</ReduxProvider>
                        </div>
                    </div>

                    {/* Sidebar Toggle Button  */}
                    <button
                        className="absolute left-3 bottom-4 transform -translate-x-1/2 bg-gray-800 text-white p-2 rounded-md z-50"
                        onClick={toggleSidebar}
                    >
                        <SlArrowRight
                            size={16}
                            className={isSidebarOpen ? "rotate-180 transition-transform" : "transition-transform"}
                        />
                    </button>
                </div>
            </body>
        </html>
    );
}
