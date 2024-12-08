const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    highestDegree: { type: String, required: true },
    university: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    skills: { type: String, required: true },
    resume: { type: String }, // File upload (optional)
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", applicationSchema);
