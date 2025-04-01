"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Typical from "react-typical";

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center space-y-7">
      {/* Typing Animation */}
      <h1 className="text-5xl font-semibold text-white font-mono">
        <Typical
          steps={["Transcript Generator", 5000, "Your Digital Marksheet", 5000]}
          loop={Infinity}
          wrapper="span"
        />
      </h1>

      <div className="space-x-4 flex">
        {/* Glowing Buttons */}
        <Button
          className="bg-white text-black hover:bg-white shadow-lg hover:shadow-white transition duration-300"
          onClick={() => router.push("/add-student")}
        >
          Add Student
        </Button>

        <Button
          className="text-white border border-white hover:bg-gray-700 shadow-lg hover:shadow-gray-500 transition duration-300"
          onClick={() => router.push("/all-students")}
        >
          View Added Students
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
