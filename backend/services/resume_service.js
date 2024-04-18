const Resume = require('../models/resume');
const { spawn }  = require('child_process');

exports.analyzeResume = async (resumeId, jobDescription) => {
    try {
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            throw new Error('Resume not found');
        }

        const pythonProcess = spawn('python', ['../utils/analyzeresume.py', resume.content, jobDescription]);
        let analysisResult = '';

        pythonProcess.stdout.on('data', (data) => {
            analysisResult += data.toString();
        });

        return new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python process exited with code ${code}`));
                } else {
                    resolve(JSON.parse(analysisResult));
                }
            });
        });
    } catch (error) {
        throw error;
    }
};