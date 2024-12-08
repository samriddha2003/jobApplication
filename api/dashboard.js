const mongoose = require('mongoose');

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

module.exports = async (req, res) => {
    if (req.method === 'GET') {
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
            res.status(500).send("Failed to fetch applications.");
        }
    } else {
        res.status(405).send("Method Not Allowed");
    }
};
