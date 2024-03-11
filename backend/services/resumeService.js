const Resume = require('../models/resume');
const fs = require('fs');
const path = require('path');
const { analyzeResume } = require('../utils/resumeAnalyzer');

class ResumeService {
    constructor() {}

    async uploadResume(userId, filename, filePath) {
        try {
            const resume = new Resume({
                userId,
                filename,
                path: filePath
            });
            await resume.save();
            return resume;
        } catch (error) {
            console.error('Error uploading resume:', error);
            throw new Error('Failed to upload resume to the database');
        }
    }

    async getResumeByUserId(userId) {
        try {
            const resume = await Resume.findOne({ userId });
            return resume;
        } catch (error) {
            console.error('Error fetching resume: ', error);
            throw new Error('Failed to fetch resume');
        }
    }

    async analyzeResume(resumeId, jobDescription) {
        try {
            const resume = await Resume.findById(resumeId);
            if (!resume) {
                throw new Error('Resume not found');
            }
            const resumePath = path.join(__dirname, '..', 'uploads', resume.filename);
            const analysisReport = await analyzeResume(resumePath, jobDescription);
            await this.updateAnalysisReport(resumeId, analysisReport);
            return analysisReport;
        } catch (error) {
            console.error('Error analyzing resume: ', error);
            throw new Error('Failed to analyze resume');
        }
    }

    async updateAnalysisReport(resumeId, analysisReport) {
        try {
            const updatedResume = await Resume.findByIdAndDelete(resumeId, { $set: { analysisReport } }, { new: true });
            return updatedResume;
        } catch (error) {
            console.error('Error updating analysis report:', error);
            throw new Error('Failed to update analysis report');
        }
    }

    async deleteResume(resumeId) {
        try {
            const resume = await Resume.findByIdAndDelete(resumeId);
            if (resume) {
                fs.unlinkSync(resume.path);
            }
        } catch (error) {
            console.error('Error deleting resume:', error);
            throw new Error('Failed to delete resume');
        }
    }
}

module.exports = new ResumeService();