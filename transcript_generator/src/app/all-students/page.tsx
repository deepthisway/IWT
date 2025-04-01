"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
    const handelGenerateTranscript = (student: any) => {
        try {
            // console.log("student id is", student._id);
            const res = axios.post("/api/transcript-generate", {studentId: student._id});
            toast.info("Transcript generated successfully");
        } catch (error) {
            toast.error("Failed to generate transcript");
        }

  }
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
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">Student List</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <span>Loading...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.roll}</TableCell>
                <TableCell>{student.cgpa}</TableCell>
                <TableCell>
                  {student.subjects.map((subject: any) => (
                    <div key={subject._id}>
                      {subject.name} ({subject.marks} - {subject.grade})
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={()=> handelGenerateTranscript(student)}>
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
