"use client";

import { useState, useEffect } from "react";
import { SlArrowRight } from "react-icons/sl";
import ChatWithAI from "@/components/chatWithAi";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ReduxProvider from "../../redux/ReduxProvider";
import "../../app/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const updateImagePosition = () => {
      setImagePosition({
        x: window.innerWidth * 0.95,
        y: window.innerHeight * 0.91,
      });
    };

    updateImagePosition(); // Set initial position
    window.addEventListener("resize", updateImagePosition);

    return () => window.removeEventListener("resize", updateImagePosition);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openChat = () => setIsChatOpen((prev) => !prev);

  // Start dragging
  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true);
    setOffset({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  // Move the image
  const onDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!dragging) return;
    setImagePosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  // Stop dragging
  const stopDrag = () => setDragging(false);

  return (
    <html lang="en">
      <body className="antialiased" onMouseMove={onDrag} onMouseUp={stopDrag}>
        <ReduxProvider>
          <div className="h-screen flex flex-col">
            {/* Navbar */}
            <div className="w-full fixed top-0 bg-white z-40 h-16 shadow-md">
              <Navbar />
            </div>

            <div className="flex h-full">
              {/* Sidebar */}
              <div
                className={`fixed h-full z-30 bg-white shadow-md transition-transform duration-300 ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ width: "212px" }}
              >
                <Sidebar />
              </div>

              {/* Main Content */}
              <div
                className={`transition-all duration-300 flex-1 pt-20 overflow-y-auto scrollbar-hidden ${
                  isSidebarOpen ? "ml-[210px]" : ""
                }`}
              >
                {children}
              </div>
            </div>

            {/* Sidebar Toggle Button */}
            <button
              className="absolute left-3 bottom-4 transform -translate-x-1/2 bg-gray-800 text-white p-2 rounded-md z-50"
              onClick={toggleSidebar}
            >
              <SlArrowRight
                size={16}
                className={
                  isSidebarOpen
                    ? "rotate-180 transition-transform"
                    : "transition-transform"
                }
              />
            </button>

            {/* Draggable Blackbox AI Image */}
            <div
              className="fixed cursor-grab active:cursor-grabbing z-[9999]"
              style={{
                left: `${imagePosition.x}px`,
                top: `${imagePosition.y}px`,
              }}
              onMouseDown={startDrag}
              onClick={openChat}
            >
              <img
                src="/logo.png"
                alt="Chat AI"
                className="w-12 h-12 z-50 rounded-full border-[1px] border-black hidden sm:block"
              />
            </div>

            {/* AI Chat Modal Above the Image */}
            {isChatOpen && (
              <div
                className="fixed w-80 h-[500px shadow-lg rounded-lg z-50 hidden sm:block"
                style={{
                  left: `${imagePosition.x - 355}px`,
                  top: `${imagePosition.y - 615}px`,
                }}
              >
                <ChatWithAI />
                <button
                  className="absolute text-[18px] top-2 left-[370px] text-black p-1 rounded-full"
                  onClick={() => setIsChatOpen(false)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
