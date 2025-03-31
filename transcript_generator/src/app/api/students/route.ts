import { connectDB } from "@/lib/db";
import Student from "@/models/student";
import { NextRequest, NextResponse } from "next/server";

const getGrade = (marks: number) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C+";
    if (marks >= 40) return "C";
    return "F";
}

const calculateCGPA = (subjects : {marks : number}[]) => {
    if(!subjects.length) return 0;

    const gradePoints: Record<string, number> = {
        "A+": 4.0,
        "A": 3.7,
        "B+": 3.3,
        "B": 3.0,
        "C+": 2.3,
        "C": 2.0,
        "F": 0.0,
    };
      
      const totalPoints = subjects.reduce((sum, { marks }) => sum + gradePoints[getGrade(marks)], 0);
      console.log("total points", totalPoints);

      return Math.round((totalPoints / subjects.length) * 100) / 100;
}

export async function POST(req: NextRequest)    {
    await connectDB();
    
    try {
        const data = await req.json();
        console.log("data is", data)
        // assign grades
        const subjectsWithGrades = data.subjects.map((subject : {name: string; marks: number}) => ({
            name: subject.name,
            marks: subject.marks,
            grade: getGrade(subject.marks)
        }))
        const cgpa = calculateCGPA(subjectsWithGrades);

        const newStudent = new Student({
            ...data,
            subjects: subjectsWithGrades,
            cgpa
        })

        await newStudent.save();
        return NextResponse.json({
            status: "success",
            message: "Student added successfully"
        },  {
            status: 201
        })

    } catch (error) {
        console.log("Error in POST /api/students", error);
        return NextResponse.json({
            status: "error",
            message: "Something went wrong in "
        },{
            status: 500
        })
    }
}

export async function GET(res: NextResponse) {
    await connectDB();

    try{
        const students = await Student.find();
        return NextResponse.json({
            status: "success",
            data: students
        },{
            status: 200
        })
    }
    catch(error)    {
        console.log("Error in GET /api/students", error);
        return NextResponse.json({
            status: "error",
            message: "Something went wrong in GET /api/students"
        },{
            status: 500
        })
    }
}