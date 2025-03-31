const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/studentsDB", { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const StudentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    course: { type: String, required: true },
    marks: {
        math: Number,
        science: Number,
        english: Number,
        history: Number,
        geography: Number
    }
});

const Student = mongoose.model("Student", StudentSchema);

app.post("/api/students", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.json({ message: "Student details saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving data", error });
    }
});

app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
