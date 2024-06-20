import { FaRobot } from "react-icons/fa";

export default function AIResponse({ jawab }) {
  return (
    <>
      <div className="mb-5 flex gap-2 items-start pt-3">
        <div className="rounded-full bg-blue-950 py-2 px-2 font-bold text-2xl text-white">
          <FaRobot />
        </div>
        <p className="text-white text-sm text-justify">{jawab}</p>
      </div>
    </>
  );
}
