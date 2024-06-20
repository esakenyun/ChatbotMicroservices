import Link from "next/link";

export default function HomePageComponent() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#212121]">
        <div className="flex flex-col text-white w-full px-5 lg:px-32 lg:w-1/2">
          <p className="text-2xl font-bold">Welcome, to</p>
          <p className="text-2xl font-thin">Microservices Chatbot</p>
          <div className="pt-5">
            <p>
              Efficient, friendly, and always ready to assist, our chatbot streamlines your interactions with seamless communication. Whether it's answering inquiries, providing guidance, or offering solutions, our chatbot delivers prompt
              and personalized assistance, enhancing your experience effortlessly.
            </p>
          </div>
          <div className="pt-5 flex justify-center">
            <div className="flex gap-3">
              <Link href="/auth">
                <button className="py-2 px-5 rounded-2xl bg-blue-500 font-bold hover:scale-105">Sign In</button>
              </Link>
              <Link href="/auth/signup">
                <button className="py-2 px-5 rounded-2xl bg-green-500 font-bold hover:scale-105">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-1/2 px-32 hidden lg:block">
          <div className="py-10 px-5 bg-gray-300 rounded-2xl">
            <div className="flex justify-end gap-2 items-start">
              <div className="text-base py-2 px-3 rounded-md bg-[#2f2f2f] text-white">Give me prompt Hello World in Java</div>
              <p className="rounded-full bg-purple-600 text-white font-bold py-2 px-3 text-sm">U</p>
            </div>
            <div className="flex justify-start gap-2 items-start mt-5">
              <p className="rounded-full bg-blue-950 text-white font-bold py-2 px-3 text-sm">G</p>
              <div className="flex flex-col w-full gap-2">
                <div className="text-xs py-3 px-3 rounded-md animate-pulse w-1/2 bg-slate-500"></div>
                <div className="text-xs py-3 px-3 rounded-md animate-pulse w-1/2 bg-slate-500"></div>
                <div className="text-xs py-3 px-3 rounded-md animate-pulse w-1/2 bg-slate-500"></div>
                <div className="text-xs py-3 px-3 rounded-md animate-pulse w-1/2 bg-slate-500"></div>
                <div className="text-xs py-3 px-3 rounded-md animate-pulse w-1/2 bg-slate-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
