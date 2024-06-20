"use client";
import { IoIosLogOut } from "react-icons/io";
import { IoPersonOutline, IoSend } from "react-icons/io5";
import { requestToGroqAI } from "@/utils/groq";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/helpers/authHelper";
import UserPrompt from "@/components/card/UserPrompt";
import AIResponse from "@/components/card/AIResponse";
import { handleGenerateResponse, handleGetAllHistory, handlePrompt } from "@/helpers/aiHelper";

export default function PromptPage() {
  const router = useRouter();
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdown, setDropdown] = useState(false);
  const [value, setValue] = useState("");
  const [text, setText] = useState([]);
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInput = (event) => {
    const textarea = textareaRef.current;
    setValue(event.target.value);
    textarea.style.height = "auto";
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const maxHeight = 4 * lineHeight;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
    } else {
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    const userPrompt = value;
    setValue("");

    const localStorageHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const newEntry = { question: userPrompt, response: "" };
    localStorageHistory.push(newEntry);
    localStorage.setItem("chatHistory", JSON.stringify(localStorageHistory));
    displayHistory();

    console.log("%cPost and Get Response Started....", "color: white; font-weight: bold; background: red; padding: 10px");
    console.time("Post and Get Response");
    const ai = await requestToGroqAI(userPrompt);
    const responsePrompt = await handlePrompt(userPrompt);
    const { prompt_id, text } = responsePrompt.data.data;
    const responseGrog = await handleGenerateResponse(prompt_id, text, ai);
    console.timeEnd("Post and Get Response");
    console.log("%cPost and Get Response Done!....", "color: white; font-weight: bold; background: green; padding: 10px");

    const updatedHistory = JSON.parse(localStorage.getItem("chatHistory"));
    updatedHistory[updatedHistory.length - 1].response = ai;
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    displayHistory();
  };

  const handleButtonLogout = async () => {
    const response = await handleLogout();
    router.push("/auth");
  };

  const getAllHistory = async () => {
    const handle = await handleGetAllHistory();
    const dbHistory = handle.map((item) => ({ question: item.text, response: item.response }));
    localStorage.setItem("dbHistory", JSON.stringify(dbHistory));
    displayHistory();
  };

  const displayHistory = () => {
    const dbHistory = JSON.parse(localStorage.getItem("dbHistory")) || [];
    const localStorageHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    const combinedHistory = [...dbHistory, ...localStorageHistory];
    const uniqueHistory = Array.from(new Map(combinedHistory.map((item) => [item.question, item])).values());

    const newText = uniqueHistory.map((item) => item.question);
    const newResponse = uniqueHistory.map((item) => item.response);
    setText(newText);
    setResponse(newResponse);
  };

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  useEffect(() => {
    getAllHistory();
  }, []);

  return (
    <main className="flex flex-col items-center pt-10">
      <div className="flex flex-col gap-1 w-full max-w-md">
        <h1 className="lg:text-2xl text-white text-center">Microservices | GROQ AI</h1>
        <div className="flex items-center justify-center mt-1">
          <div className="w-fit bg-[#2f2f2f] py-1 px-2 text-xs rounded-2xl text-slate-300 font-bold">
            <p>Your Chat</p>
          </div>
        </div>
      </div>
      <div className="absolute top-28 left-0 w-full px-5 pr-14 lg:pr-64 lg:px-64 pb-36">
        {text.map((item, index) => (
          <div key={index} className="mb-4">
            {index > 0 && <hr className="border-gray-600 my-2 w-full" />}
            <div className="flex justify-end">
              <UserPrompt question={item} />
            </div>
            <hr className="border-gray-600 my-2" />
            <div className="flex justify-start">
              <AIResponse jawab={response[index]} />
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-7 left-0 w-full lg:px-64 px-5">
        <div className="bg-[#212121]">
          <form className="flex items-center gap-2 bg-[#2f2f2f] rounded-2xl p-2">
            <textarea ref={textareaRef} rows={1} value={value} onInput={handleInput} className="rounded-md p-2 w-full resize-none bg-transparent text-white focus:outline-none" placeholder="Tuliskan pesan Anda..." id="prompt" />
            <button onClick={handleSubmit} type="button" className="rounded-md bg-blue-600 text-white p-2 hover:bg-blue-700 hover:text-black">
              <IoSend />
            </button>
          </form>
        </div>
      </div>
      <div className="fixed bottom-0 bg-[#212121] w-full flex justify-center text-sm py-1 text-white">Microservices | Grog AI</div>
      <div className="fixed right-5 lg:right-20" ref={dropdownRef}>
        <div onClick={toggleDropdown} className="bg-blue-500 cursor-pointer py-2 px-2 rounded-full">
          <IoPersonOutline className="lg:text-3xl text-white" />
        </div>
        {dropdown && (
          <div className="absolute right-0 top-14 bg-white shadow-md rounded-md p-1">
            <ul>
              <li>
                <button className="hover:bg-red-500 py-1 px-3 w-full text-left text-sm flex gap-2 items-center hover:rounded-md hover:text-white" onClick={handleButtonLogout}>
                  <IoIosLogOut className="text-xl" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
