
import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/db"
import Student from "@/models/student";
import PDFDocument from "pdfkit";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Parse the request body
    const body = await req.json();
    const { studentId } = body;
    console.log("stdid", studentId);
    
    if (!studentId) {
      return NextResponse.json(
        { status: "error", message: "Student ID is required" },
        { status: 400 }
      );
    }
    
    // Find the student by ID
    const student = await Student.findById(studentId);
    
    if (!student) {
      return NextResponse.json(
        { status: "error", message: "Student not found" },
        { status: 404 }
      );
    }
    
    // Create a PDF document
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      size: "A4",
    });
    
    // Create a buffer to store the PDF
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    
    // Wait for the PDF to be generated
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
    });
    
    // Add university logo or header
    doc.fontSize(20).font('Times-Roman').text('UNIVERSITY TRANSCRIPT', { align: 'center' });
    doc.moveDown();
    
    // Add a horizontal line
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown();
    
    // Add student information
    doc.fontSize(14).font('Times-Roman').text('Student Information');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Times-Roman');
    doc.text(`Name: ${student.name}`);
    doc.text(`Roll Number: ${student.rollno}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Phone: ${student.phone}`);
    doc.text(`Date of Birth: ${new Date(student.dob).toLocaleDateString()}`);
    doc.text(`Address: ${student.address}`);
    doc.moveDown();
    
    // Add academic information
    doc.fontSize(14).font('Times-Roman').text('Academic Performance');
    doc.moveDown(0.5);
    
    // Create a table for subjects
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidth = (doc.page.width - 100) / 3;
    
    // Table headers
    doc.fontSize(12).font('Times-Roman');
    doc.text('Subject', tableLeft, tableTop);
    doc.text('Marks', tableLeft + colWidth, tableTop);
    doc.text('Grade', tableLeft + colWidth * 2, tableTop);
    
    // Draw a line under the headers
    doc.moveTo(tableLeft, tableTop + 20)
       .lineTo(doc.page.width - 50, tableTop + 20)
       .stroke();
    
    // Table rows
    let rowTop = tableTop + 30;
    doc.fontSize(12).font('Times-Roman');
    
    student.subjects.forEach((subject: any) => {
      doc.text(subject.name, tableLeft, rowTop);
      doc.text(subject.marks.toString(), tableLeft + colWidth, rowTop);
      doc.text(subject.grade, tableLeft + colWidth * 2, rowTop);
      rowTop += 20;
    });
    
    // Draw a line under the subjects
    doc.moveTo(tableLeft, rowTop)
       .lineTo(doc.page.width - 50, rowTop)
       .stroke();
    
    rowTop += 20;
    
    // Add CGPA information
    doc.fontSize(14).font('Times-Roman').text(`CGPA: ${student.cgpa}`, tableLeft, rowTop);
    doc.moveDown(2);
    
    // Add signature lines
    const signatureY = doc.y + 30;
    doc.fontSize(12).font('Times-Roman');
    
    doc.text('_____________________', 100, signatureY);
    doc.text('_____________________', doc.page.width - 230, signatureY);
    
    doc.text('Registrar', 130, signatureY + 20);
    doc.text('Dean of Faculty', doc.page.width - 200, signatureY + 20);
    
    // Add footer
    const footerY = doc.page.height - 50;
    doc.fontSize(10).font('Times-Roman');
    // doc.text('This is an official transcript of the University.', { align: 'center' }, footerY);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    
    // Finalize the PDF
    doc.end();
    
    // Wait for the PDF to be generated
    const pdfBuffer = await pdfPromise;
    
    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${student.name.replace(/\s+/g, '_')}_transcript.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/generate-transcript:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Something went wrong while generating the transcript" 
      },
      { status: 500 }
    );
  }
}