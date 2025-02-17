// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "../../../redux/app/store";
// import { fetchAiHistory, chatAi } from "../../../redux/features/aiSlice";
// import { AiOutlineSend } from "react-icons/ai";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";


// const ChatWithAI = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [input, setInput] = useState<string>("");
//   const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const aiHistory = useSelector((state: RootState) => state.aichat.aiHistory);
//   const loading = useSelector((state: RootState) => state.aichat.loading);

//   // Fetch chat history on mount
//   useEffect(() => {
//     dispatch(fetchAiHistory());
//   }, [dispatch]);

//   // Scroll to the bottom whenever aiHistory updates
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [aiHistory, pendingQuestion]);

//   const handleGenerate = () => {
//     if (!input.trim() || loading) return;

//     setPendingQuestion(input); // Save current input before sending
//     dispatch(chatAi(input));
//     setInput(""); // Clear input field
//   };

//   return (
//     <div className="max-w-md mx-auto h-[550px] flex flex-col bg-white rounded-md">
//       {/* Header */}
//       <div className="p-4 bg-white text-black text-lg font-semibold flex items-center gap-3">
//         {/* <img
//           src="/Trendy Person Avatar.png"
//           alt="Avatar"
//           className="w-12 h-12 border border-gray-300"
//         /> */}
//         <div>
//           <h1 className="text-xl">ScrumX.ai</h1>
//           <p className="text-sm text-gray-500">How can I help you today?</p>
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div
//         ref={chatContainerRef}
//         className="flex-1 overflow-y-auto p-2 space-y-4"
//       >
//         {aiHistory.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
//               I'm Haneena
//             </p>
//           </div>
//         ) : (
//           <>
//             {aiHistory.map((chat, index) => (
//               <div key={index} className="flex flex-col p-3 my-2">
//                 {/* User Message */}
//                 <div className="self-end bg-gray-200 text-black px-4 py-3 rounded-md max-w-sm shadow-md">
//                   {chat.question}
//                 </div>

//                 {/* AI Response */}
//                 <div className="self-start bg-gray-50 text-black px-6 py-4 rounded-md w-full shadow-md border mt-3">
//                   <ReactMarkdown
//                     remarkPlugins={[remarkGfm]}
//                     components={{
//                       code({ node, inline, className, children, ...props }) {
//                         const match = /language-(\w+)/.exec(className || "");
//                         return !inline && match ? (
//                           <SyntaxHighlighter
//                             style={dracula}
//                             language={match[1]}
//                             PreTag="div"
//                             {...props}
//                           >
//                             {String(children).replace(/\n$/, "")}
//                           </SyntaxHighlighter>
//                         ) : (
//                           <code className={className} {...props}>
//                             {children}
//                           </code>
//                         );
//                       },
//                     }}
//                   >
//                     {chat.answer}
//                   </ReactMarkdown>
//                 </div>
//               </div>
//             ))}

//             {/* Show "Thinking..." for the latest user input */}
//             {loading && pendingQuestion && (
//               <div className="flex flex-col">
//                 <div className="self-end bg-gray-200 text-black px-4 py-2 rounded-lg max-w-sm shadow-md">
//                   {pendingQuestion}
//                 </div>
//                 <div className="self-start bg-gray-100 text-black px-6 py-3 rounded-lg w-full shadow-md border mt-1">
//                   <span className="animate-pulse">Thinking...</span>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Input Section */}
//       <div className="p-4 bg-white flex items-center gap-2">
//         {/* Input Box */}
//         <div className="flex-1 flex items-center bg-gray-200 rounded-md px-4 py-2">
//           <textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Message ScrumX"
//             className="flex-1 bg-transparent text-black resize-none outline-none focus:outline-none h-10 max-h-32 overflow-y-auto"
//   style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 handleGenerate();
//               }
//             }}
//           />
//           <button
//             onClick={handleGenerate}
//             className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
//             disabled={loading}
//           >
//             <AiOutlineSend className="text-2xl" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWithAI;
