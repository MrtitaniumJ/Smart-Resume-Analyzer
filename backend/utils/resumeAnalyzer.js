const { execSync } = require('child_process');
const path = require('path');

const analyzeResume = async (resumeContent, jobDescription) => {
    try {
        if (!resumeContent || !jobDescription) {
            throw new Error('Resume content or job description is undefined');
        }

        const analyzeResumeScriptPath = path.join(__dirname, 'utils', 'analyze_resume.py');
        const escapedResumePath = `"${resumeContent.replace(/"/g, '\\"')}"`;
        const escapedJobDescription = `"${jobDescription.replace(/"/g, '\\"')}"`;
        const command = `python "${analyzeResumeScriptPath}" ${escapedResumePath} ${escapedJobDescription}`;
        const output = execSync(command, { encoding: 'utf-8' });
        return JSON.parse(output);
    } catch (error) {
        console.error('Error analyzing resume:', error);
        throw new Error('Failed to analyze resume');
    }
};

module.exports = { analyzeResume };