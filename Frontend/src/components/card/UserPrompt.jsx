export default function UserPrompt({ question }) {
  return (
    <>
      {/* <div className="rounded-full bg-purple-500 py-2 px-2 font-bold text-2xl text-white">
          <IoPerson />
        </div> */}
      <p className="text-white text-sm text-justify w-fit py-3 px-3 bg-[#2f2f2f] rounded-lg">{question}</p>
    </>
  );
}
