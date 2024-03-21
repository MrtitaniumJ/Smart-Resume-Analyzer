const Resume = require('../models/resume');
const ResumeService = require('../services/resumeService');
const { analyzeResume } = require('../services/resumeService');

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.userId;
        const filePath = req.file.path;

        const uploadedResume = await ResumeService.uploadResume(userId, filePath);

        res.status(201).json({ message: 'Resume uploaded successfully', resume: uploadedResume });
    } catch (error) {
        console.error('Error uploading resume: ', error);
        res.status(500).json({ error: 'An error occurred while uploading resume' });
    }
};

exports.analyzeResume = async (req, res) => {
    try {
        let { resumeId } = req.params;

        if (resumeId.startsWith(':')) {
            resumeId = resumeId.slice(1);
        }
        const jobDescription = req.body.jobDescription;

        const analysisResult = await ResumeService.analyzeResume(resumeId, jobDescription);
        const report = ResumeService.generateReport(analysisResult);

        res.status(200).json({ message: 'Resume report generated', data: report });
        //res.status(200).json({ message: 'Resume analysis completed', analysis: analysisResult });
    } catch (error) {
        console.error('Error analyzing resume:', error);
        if (error.message === 'Resume not found') {
            res.status(404).json({ error: 'Resume not found' });
        } else {
            res.status(500).json({ error: 'Failed to analyze resume' });
        }
    }
};
