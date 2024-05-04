const fs = require('fs');
const path = require('path');
const { PythonShell } = require('python-shell');
const Resume = require('../models/resume');
const pdf = require('pdf-parse');

class ResumeService {
    async uploadResume(userId, filePath) {
        try {
            // Read file content
            // const fileContent = fs.readFileSync(filePath, 'utf-8');
            const resumeContent = await this.extractTextFromPDF(filePath);
            // Save file details to the database
            const resume = new Resume({
                userId: userId,
                filename: path.basename(filePath),
                path: filePath,
                content: resumeContent
            });
            await resume.save();
            return resume;
        } catch (error) {
            console.error('Error uploading resume: ', error);
            throw new Error(error.message || 'Failed to upload resume');
        }
    }

    async extractTextFromPDF(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            console.error('Error extracting text from PDF: ', error);
            throw new Error(error.message || 'Failed to extract text from PDF');
        }
    }

    async analyzeResume(resumeId, jobDescription) {
        try {
            const resume = await this.getResumeById(resumeId);
            if (!resume) {
                throw new Error('Resume not found');
            }

            // resume content string
            const resumeContent = resume.content.toString();
    
            // Call python script for analysis
            const options = {
                mode: 'json',
                pythonPath: 'python',
                pythonOptions: ['-u'],
                scriptPath: path.join(__dirname, '..', 'utils'),
                args: [resume.content, jobDescription]
            };
    
            const results = await PythonShell.run('resume_analyzer.py', options);
            console.log("Analysis results:", results);
    
            // Ensure that results contain valid data
            if (results && results.length > 0 && results[0] && !results[0].error) {
                const report = results[0];
                // Update resume with analysis report
                await this.updateAnalysisReport(resumeId, report);
                return { message: 'Resume report generated', data: report };
            } else {
                throw new Error('Analysis result is not available');
            }
        } catch (error) {
            console.error('Error analyzing resume:', error);
            throw new Error(error.message || 'Failed to analyze resume');
        }
    }    

    async getResumeById(resumeId) {
        try {
            const resume = await Resume.findById(resumeId);
            return resume;
        } catch (error) {
            console.error('Error fetching resume: ', error);
            throw new Error(error.message || 'Failed to fetch resume');
        }
    }

    async updateAnalysisReport(resumeId, analysisReport) {
        try {
            const updatedResume = await Resume.findByIdAndUpdate(resumeId, { $set: { analysisReport } }, { new: true });
            if (!updatedResume) {
                throw new Error('Resume not found');
            }
            return updatedResume;
        } catch (error) {
            console.error('Error updating analysis report: ', error);
            throw new Error(error.message || 'Failed t update analysis report');
        }
    }

    async deleteResume(resumeId) {
        try {
            const resume = await Resume.findByIdAndDelete(resumeId);
            if (resume) {
                fs.unlinkSync(resume.path);
            }
        } catch (error) {
            console.error('Error deleting resume: ', error);
            throw new Error('Failed to delete resume');
        }
    }
}

module.exports = new ResumeService();