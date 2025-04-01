import { connectDB } from "@/lib/db";
import Student from "@/models/student";
import { NextRequest, NextResponse } from "next/server"; 
/* eslint-disable no-console */

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        // Extract ID from the URL path
        const url = new URL(req.url);
        const pathSegments = url.pathname.split('/');
        const id = pathSegments[pathSegments.length - 1];
        
        if (!id) {
            return NextResponse.json({
                status: false,
                msg: "No ID provided in the request"
            }, {
                status: 400
            });
        }
        
        const student = await Student.findById(id);
        if (!student) {
            return NextResponse.json({
                status: false,
                msg: "No student exist with this ID"
            }, {
                status: 404
            });
        }
        
        return NextResponse.json({
            status: "success",
            data: student
        }, {
            status: 200
        });
    } catch (error) {
        console.log("Error in GET /api/students/[id]", error);
        return NextResponse.json({
            status: "error",
            message: "Something went wrong in GET /api/students/[id]"
        }, {
            status: 500
        });
    }
}