const Resume = require('../models/resume');
const ResumeService = require('../services/resumeService');

exports.uploadResume = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.userId;

        const resumeData = {
            userId: userId,
            filename: req.file.filename,
            path: req.file.path
        };
        const uploadedResume = await ResumeService.uploadResume(resumeData);

        res.status(201).json({ message: 'Resume uploaded successfully', resume: uploadedResume });
    } catch (error) {
        console.error('Error uploading resume: ', error);
        res.status(500).json({ error: 'An error occurred while uploading resume' });
    }
};

exports.analyzeResume = async (req, res) => {
    try {
        const resumeId = req.params.resumeId;

        const analysisResult = await ResumeService.analyzeResume(resumeId);

        res.status(200).json({ message: 'Resume analysis completed', analysis: analysisResult });
    } catch (error) {
        console.error('Error analyzing resume: ', error);
        res.status(500).json({ error: 'An error occurred while analyzing resume' });
    }
};
