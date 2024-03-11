const natural = require('natural');

// Tokenizer and stemmer initialization
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Placeholder function for analyzing resumes based on job description
exports.analyzeResume = (resumeContent, jobDescription) => {
    // Tokenize and stem resume content and job description
    const resumeTokens = tokenizeAndStem(resumeContent);
    const jobDescTokens = tokenizeAndStem(jobDescription);

    // Extract unique skills from the job description
    const jobSkills = extractSkills(jobDescTokens);

    // Find matched skills from the resume
    const matchedSkills = findMatchedSkills(resumeTokens, jobSkills);

    // Find missing skills from the job description
    const missingSkills = findMissingSkills(resumeTokens, jobSkills);

    // Calculate overall score based on matched skills
    const overallScore = calculateOverallScore(matchedSkills, jobSkills);

    return {
        matchedSkills,
        missingSkills,
        overallScore
    };
};

// Tokenize and stem text 
const tokenizeAndStem = (text) => {
    return tokenizer.tokenize(text).map(token => stemmer.stem(token.toLowerCase()));
};

// Extract unique skills from the job description
const extractSkills = (tokens) => {
    return [...new Set(tokens.filter(token => token.length > 2))];
};

// Find matched skills from the resume
const findMatchedSkills = (resumeTokens, jobSkills) => {
    return jobSkills.filter(skill => resumeTokens.includes(skill));
};

// Find missing skills from the job description
const findMissingSkills = (resumeTokens, jobSkills) => {
    return jobSkills.filter(skill => !resumeTokens.includes(skill));
};

// Calculate overall score based on matched skills
const calculateOverallScore = (matchedSkills, jobSkills) => {
    return (matchedSkills.length / jobSkills.length) * 100;
};
