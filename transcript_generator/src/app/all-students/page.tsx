"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Subject {
  _id: string;
  name: string;
  code: string;
  marks: number;
  grade: string;
}
interface Student {
  _id: string;
  name: string;
  dob: string;
  roll: string;
  address: string;
  email: string;
  phone: string;
  cgpa: number;
  subjects: Subject[];
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handelGenerateTranscript = (student: Student) => {
    try {
      // const res = axios.post("/api/transcript-generate", {studentId: student._id});
      toast.info("Transcript generated successfully");
      router.push(`/transcript/${student._id}`);
    } catch (error) {
      console.error("Error generating transcript:", error);
      toast.error("Failed to generate transcript");
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/students");
        const data = await response.json();
        if (data.status === "success") {
          setStudents(data.data);
        } else {
          toast.error("Failed to fetch students");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Something went wrong while fetching students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg space-y-8">
      <h2 className="text-3xl font-semibold text-center text-black mb-6">Student List</h2>

      {loading ? (
        <div className="flex justify-center items-center text-black font-semibold">
          <span>Loading...</span>
        </div>
      ) : (
        <Table className="border-collapse w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-left py-3 px-4 font-semibold text-black">Name</TableHead>
              <TableHead className="text-left py-3 px-4 font-semibold text-black">Roll Number</TableHead>
              <TableHead className="text-left py-3 px-4 font-semibold text-black">CGPA</TableHead>
              <TableHead className="text-left py-3 px-4 font-semibold text-black">Subjects</TableHead>
              <TableHead className="text-left py-3 px-4 font-semibold text-black">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id} className="hover:bg-gray-50">
                <TableCell className="py-3 px-4 text-black">{student.name}</TableCell>
                <TableCell className="py-3 px-4 text-black">{student.roll}</TableCell>
                <TableCell className="py-3 px-4 text-black font-extrabold">{student.cgpa}</TableCell>
                <TableCell className="py-3 px-4 text-black">
                  {student.subjects.map((subject: Subject) => (
                    <div key={subject._id} className="text-sm">
                      {subject.name} ({subject.marks} - {subject.grade})
                    </div>
                  ))}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handelGenerateTranscript(student)}
                    className=" text-black hover:bg-black hover:text-white transition duration-300"
                  >
                    Generate Transcript
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default StudentList;
