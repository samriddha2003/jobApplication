const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = "mongodb+srv://samriddhadas2003:RylM1eMJuXeykHkF@cluster0.2a3wj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define the Application Schema and Model
const applicationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    education: { type: String, required: true },
    skills: { type: String, required: true },
    resume: { type: String, required: true }, // Resume file path
    submittedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Routes
// 1. POST /apply - Handle job application submissions
app.post("/apply", upload.single("resume"), async (req, res) => {
    try {
        const applicationData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            education: req.body.education,
            skills: req.body.skills,
            resume: req.file ? req.file.filename : null,
        };

        const application = new Application(applicationData);
        await application.save();
        res.status(201).send("Application submitted successfully!");
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).send("Failed to submit application.");
    }
});

// 2. GET /admin - Display all applications in the admin dashboard
app.get("/admin", async (req, res) => {
    try {
        const applications = await Application.find().sort({ submittedAt: -1 });
        let html = `
            <h1>Admin Dashboard</h1>
            <table border="1" cellpadding="10" cellspacing="0">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Education</th>
                        <th>Skills</th>
                        <th>Resume</th>
                        <th>Submitted At</th>
                    </tr>
                </thead>
                <tbody>
        `;

        applications.forEach((app, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${app.firstName}</td>
                    <td>${app.lastName}</td>
                    <td>${app.email}</td>
                    <td>${app.phone}</td>
                    <td>${app.gender}</td>
                    <td>${app.education}</td>
                    <td>${app.skills}</td>
                    <td><a href="/uploads/${app.resume}" download>Download</a></td>
                    <td>${new Date(app.submittedAt).toLocaleString()}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;
        res.send(html);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).send("Failed to fetch applications.");
    }
});

// Vercel-compatible export
module.exports = (req, res) => {
    app(req, res);
};
