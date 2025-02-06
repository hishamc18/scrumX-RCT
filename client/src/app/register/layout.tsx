/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "A Next.js app",
};

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {/* ✅ Corrected Image Path */}
        <div className="flex justify-between items-center h-screen    bg-[#FFFEFE]">
            <img src="/auth.png" className="h-full p-2 rounded-[20px] hidden xl-custom:block"></img>
        <div className="  h-full w-full flex justify-center items-center">
            <main className="  h-full w-[90%] ">{children}</main>
        </div>
        </div>
        
      </body>
    </html>
  );
}