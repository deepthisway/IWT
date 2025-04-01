"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

// Helper function to generate random IDs
const generateRandomId = (prefix: string, length = 8) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

interface Subject {
  name: string;
  code: string;
  marks: number;
  grade: string;
}

interface Student {
  name: string;
  dob: string;
  roll: string;
  address: string;
  email: string;
  phone: string;
  cgpa: number;
  subjects: Subject[];
}

const TranscriptPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollmentNumber] = useState(`ENR${generateRandomId('', 10)}`);
  const [marksheetNumber] = useState(`MS${generateRandomId('', 8)}`);
  
  useEffect(() => {
    if (!id) return;
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
        const studentData = response.data.data;
        setStudent(studentData);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      }
    };
    
    fetchStudent();
  }, [id]);

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student transcript...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 min-h-screen font-mono">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-800 p-6 text-white">
          <div className="flex items-center">
            {/* Logo placeholder */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-xs text-gray-500 mr-6">
              <Image src="/logo.png" alt="NIT Kurukshetra" width={80} height={80} className='rounded-4xl' />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-center font-serif">NATIONAL INSTITUTE OF TECHNOLOGY</h1>
              <h2 className="text-xl font-semibold text-center">KURUKSHETRA, HARYANA, 136119</h2>
              <p className="text-center mt-2">
                <span className="bg-white text-black px-4 py-1 rounded-full font-bold">Year: 2024-25</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Student Information */}
        <div className="p-6 border-b-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Student Name</p>
                <p className="font-bold text-lg">{student.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Roll Number</p>
                <p className="font-bold">{student.roll}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Enrollment Number</p>
                <p className="font-bold">{enrollmentNumber}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Marksheet Number</p>
                <p className="font-bold">{marksheetNumber}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Academic Session</p>
                <p className="font-bold">2024-2025</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Marks Table */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-800 border-b-2 border-blue-800 pb-2">
            ACADEMIC PERFORMANCE
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">S.No.</th>
                  <th className="border p-3 text-left">Subject Code</th>
                  <th className="border p-3 text-left">Subject Name</th>
                  <th className="border p-3 text-center">Marks</th>
                  <th className="border p-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {student.subjects.map((subject, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3 font-medium">{subject.code}</td>
                    <td className="border p-3">{subject.name}</td>
                    <td className="border p-3 text-center font-medium">{subject.marks}</td>
                    <td className="border p-3 text-center font-bold">
                      <span className={`px-2 py-1 rounded ${
                        subject.grade === 'A+' || subject.grade === 'A' ? 'bg-green-100 text-green-800' :
                        subject.grade === 'B+' || subject.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        subject.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        subject.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {subject.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* CGPA and Summary */}
          <div className="mt-6 flex flex-wrap justify-between items-center">
            <div className="mt-4 p-4 border-2 border-blue-800 rounded-lg bg-blue-50">
              <p className="text-gray-600 mb-1">CGPA</p>
              <p className="text-3xl font-bold text-blue-800">{student.cgpa.toFixed(2)}</p>
            </div>
            
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Grading Scale:</p>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-1">
                  <p>A+ (90-100): Outstanding</p>
                  <p>B+ (70-79): Good</p>
                  <p>A (80-89): Excellent</p>
                  <p>B (60-69): Above Average</p>
                  <p>C (50-59): Average</p>
                  <p>D (40-49): Pass</p>
                  <p>F (Below 40): Fail</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t flex flex-wrap justify-between items-center">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center">
              <svg className="w-20 h-20" viewBox="0 0 100 100">
                <rect x="10" y="10" width="80" height="80" fill="white" />
                <rect x="20" y="20" width="20" height="20" fill="black" />
                <rect x="60" y="20" width="20" height="20" fill="black" />
                <rect x="20" y="60" width="20" height="20" fill="black" />
                <rect x="40" y="40" width="20" height="20" fill="black" />
                <rect x="60" y="60" width="20" height="10" fill="black" />
                <rect x="70" y="60" width="10" height="20" fill="black" />
              </svg>
            </div>
            <p className="text-xs mt-2 text-gray-600">Scan to get digital copy</p>
          </div>
          
          {/* Signatures */}
          <div className="flex flex-col items-center mt-4 md:mt-0">
            <div className="h-12 mb-1">
              <p className="italic text-amber-800">Signature</p>
            </div>
            <p className="font-medium">Registrar</p>
          </div>
          
          <div className="flex flex-col items-center mt-4 md:mt-0">
            <div className="h-12 mb-1">
              <p className="italic text-amber-800">Signature</p>
            </div>
            <p className="font-medium">Director</p>
          </div>
        </div>
        
        {/* Verification */}
        <div className="p-3 bg-amber-800 text-white text-center text-xs">
          <p>This transcript is valid only with the official seal of National Institute of Technology, Kurukshetra.</p>
          <p>Verify this document at verify.nitkkr.ac.in using Marksheet Number: {marksheetNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default TranscriptPage;