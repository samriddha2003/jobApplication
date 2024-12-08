const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Set up MongoDB connection
const mongoURI = "mongodb+srv://samriddhadas2003:RylM1eMJuXeykHkF@cluster0.2a3wj.mongodb.net/job_applications?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const applicationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    education: { type: String, required: true },
    skills: { type: String, required: true },
    resume: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Handle the form submission
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        upload.single('resume')(req, res, async (err) => {
            if (err) {
                return res.status(500).send("Error during file upload.");
            }

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
                res.status(500).send("Error submitting application.");
            }
        });
    } else {
        res.status(405).send("Method Not Allowed");
    }
};
