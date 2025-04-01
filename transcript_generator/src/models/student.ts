import mongoose from "mongoose";

interface Subject{
    name: string;
    marks: number;
    grade: string;
    code: string;
}

const subjectSchema = new mongoose.Schema <Subject> ({
    name: {type: String, required: true},
    marks: {type: Number, required: true},
    grade: {type: String, required: true},
    code: {type: String, required: true}
})

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    dob: {type: Date, required: true},
    address: {type: String, required: true},
    roll: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    subjects: [subjectSchema],
    cgpa: {type: Number, required: true},
    created_at: {type: Date, default: Date.now}
})

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;