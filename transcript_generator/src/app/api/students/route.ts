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
        "A+": 10.0,
        "A": 9.0,
        "B+": 8.0,
        "B": 7.0,
        "C+": 6.0,
        "C": 5.0,
        "F": 0.0,
    };
      
      const totalPoints = subjects.reduce((sum, { marks }) => sum + gradePoints[getGrade(marks)], 0);

      return Math.round((totalPoints / subjects.length) * 100) / 100;
}

export async function POST(req: NextRequest)    {
    await connectDB();
    
    try {
        const data = await req.json();
        console.log("data is", data)
        // assign grades
        const subjectsWithGrades = data.subjects.map((subject : {name: string; marks: number; code:string}) => ({
            name: subject.name,
            code: subject.code,
            marks: subject.marks,
            grade: getGrade(subject.marks)
        }))
        const cgpa = calculateCGPA(subjectsWithGrades);

        const newStudent = new Student({
            ...data,
            roll: data.roll.toUpperCase(),
            subjects: subjectsWithGrades,
            cgpa
        })
        console.log("new student is", newStudent);

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

export async function GET() {
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