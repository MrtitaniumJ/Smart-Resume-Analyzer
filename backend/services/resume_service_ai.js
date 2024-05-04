const openai = require('openai');
const Resume = require('../models/resume');

if (!process.env.OPENAI_API_KEY) {
    throw new Error('The OPENAI_API_KEY environment variable is missing or empty');
}

const openaiAPI = new openai.OpenAI(process.env.OPENAI_API_KEY);

async function analyzeResume(resumeText, jobDescription) {
    try {
        // call openAI's api to analyze the resume
        const response = await openaiAPI.completions.create({
            engine: 'text-davinci-003',
            prompt: `Resume ${resumeText}\nJob Description: ${jobDescription}\n`,
            model: "gpt-3.5-turbo",
            max_tokens: 200,
            temperature: 0.5,
            stop: ['\n'],
            presence_penalty: 0.6,
            frequency_penalty: 0.0,
        });

        const analysisResult = response.data.choices[0].text.trim();
        return analysisResult;
    } catch (error) {
        throw new Error(error.message || 'Failed to analyze resume using OpenAI API');
    }
}

// function to generate a report
function generateReport(analysisResult) {
    try {
        const report = {};

        // extract skills from the analysis result
        const skillsRegex = /(?:softSkills|hardSkills): \[([\w\s,]+)\]/g;
        const skillsMatch = skillsRegex.exec(analysisResult);

        if (skillsMatch && skillsMatch.length > 1) {
            const skills = skillsMatch[1].split(',').map(skill => skill.trim());
            report.skills = skills;
        } else {
            throw new Error('Skills not found in analysis result');
        }

        // extract work experience from the analysis result
        const workExpRegex = /workExperience\.\w+\.position": "(.*?)",\s+"company": "(.*?)",\s+"city": "(.*?)",\s+"duration": "(.*?)"/g;
        const workExpMatches = [];
        let match;

        while (match = workExpRegex.exec(analysisResult)) {
            const position = match[1];
            const company = match[2];
            const city = match[3];
            const duration = match[4];
            workExpMatches.push({ position, company, city, duration });
        }

        if (workExpMatches.length > 0) {
            report.workExperience = workExpMatches;
        } else {
            throw new Error('Work experience not found in analysis result');
        }

        // extract education details
        const educationRegex = /education\d+": {"degree": "(.*?)",\s+"school": "(.*?)",\s+"city": "(.*?)",\s+"passingYear": "(.*?)"/g;
        const educationMatches = [];

        while (match = educationRegex.exec(analysisResult)) {
            const degree = match[1];
            const school = match[2];
            const city = match[3];
            const passingYear = match[4];
            educationMatches.push({ degree, school, city, passingYear });
        }

        if (educationMatches.length > 0) {
            report.education = educationMatches;
        } else {
            throw new Error('Education details not found in analysis result');
        }

        // extract contact information
        const contactInfoRegex = /"name": "(.*?)",\s+"emailAddress": "(.*?)",\s+"phoneNumber": "(.*?)"/g;
        const contactInfoMatch = contactInfoRegex.exec(analysisResult);

        if (contactInfoMatch && contactInfoMatch.length > 1) {
            const name = contactInfoMatch[1];
            const email = contactInfoMatch[2];
            const phoneNumber = contactInfoMatch[3];
            report.contactInfo = { name, email, phoneNumber };
        } else {
            throw new Error('Contact info not found in analysis result');
        }

        return report;

    } catch (error) {
        console.error('Error generating report: ', error);
        throw new Error(error.message || 'Failed to generate report');
    }
}

module.exports = { analyzeResume, generateReport };

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Resume = require('../models/resume');
// const nlp = require('natural');

// if (!process.env.API_KEY) {
//     throw new Error('The API_KEY environment variable is missing or empty');
// }

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// async function analyzeResume(resumeText, jobDescription) {
//     try {
//         // Leveraging gemini model suitable for text analysis
//         const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

//         // crafting a prompt combining resume and job description
//         const prompt = `Analyze the following resume:\n${resumeText}\n**In the context of:**\n${jobDescription}`;

//         const response = await model.generateContent(prompt);
//         const analysisResult = await response.response.text();

//         // enhanced extraction using NLP
//         const tokenizer = new nlp.WordTokenizer();
//         const tokens = tokenizer.tokenize(analysisResult.toLowerCase());

//         const stopwords = nlp.stopwords.entries;
//         const filteredTokens = tokens.filter(word => !stopwords.includes(word));

//         const posTagger = new nlp.PosTagger();
//         const taggedTokens = posTagger.tag(filteredTokens);

//         const skills = [];
//         for (const token of taggedTokens) {
//             const word = token[0];
//             const pos = token[1];

//             if ((pos === 'NN' || pos === 'NNS') &&
//                 (word.includes('skill') || word.includes('proficiency') ||
//                     word.includes('expertise') || word.includes('experience'))) {
//                 skills.push(word);
//             } else if (pos === 'JJ' &&
//                 (skills.length > 0 && !stopwords.includes(word))) {
//                 skills[skills.length - 1] = `${word} ${skills[skills.length - 1]}`
//             }
//         }

//         const uniqueSkills = Array.from(new Set(skills));
//         return {
//             analysisResult,
//             skills: uniqueSkills,
//         };
//     } catch (error) {
//         throw new Error(error.message || 'Failed to analyze resume using OpenAI API');
//     }
// }

// // function to generate a report
// function generateReport(analysisResult, skills) {
//     try {
//         const report = {};

//         // extract skills from the analysis result
//         const skillsRegex = /skill[s]?\b|\b(proficiency|expertise|experience in)\b\s+\w+/gi;
//         let skillsMatch = skillsRegex.exec(analysisResult);
//         if (!skillsMatch) {
//             console.warn('Skills not found using broad regex. Trying alternative format.');
//             const altSkillsRegex = /([Ss]kills|[Kk]ey [Ss]kills):\s+\[([^\]]+)\]/g;
//             skillsMatch = altSkillsRegex.exec(analysisResult);
//         }

//         if (skillsMatch) {
//             const skills = skillsMatch.map(skill => skill.trim().toLowerCase());
//             report.skills = skills;
//         } else {
//             console.warn('Skills not found using broad regex. consider using NLP libraries.');
//             throw new Error('Skills not found in analysis result');
//         }

//         // extract work experience from the analysis result
//         const workExpRegex = /workExperience\.\w+\.position": "(.*?)",\s+"company": "(.*?)",\s+"city": "(.*?)",\s+"duration": "(.*?)"/g;
//         const workExpMatches = [];
//         let match;

//         while (match = workExpRegex.exec(analysisResult)) {
//             const position = match[1];
//             const company = match[2];
//             const city = match[3];
//             const duration = match[4];
//             workExpMatches.push({ position, company, city, duration });
//         }

//         if (workExpMatches.length > 0) {
//             report.workExperience = workExpMatches;
//         } else {
//             throw new Error('Work experience not found in analysis result');
//         }

//         // extract education details
//         const educationRegex = /education\d+": {"degree": "(.*?)",\s+"school": "(.*?)",\s+"city": "(.*?)",\s+"passingYear": "(.*?)"/g;
//         const educationMatches = [];

//         while (match = educationRegex.exec(analysisResult)) {
//             const degree = match[1];
//             const school = match[2];
//             const city = match[3];
//             const passingYear = match[4];
//             educationMatches.push({ degree, school, city, passingYear });
//         }

//         if (educationMatches.length > 0) {
//             report.education = educationMatches;
//         } else {
//             throw new Error('Education details not found in analysis result');
//         }

//         // extract contact information
//         const contactInfoRegex = /"name": "(.*?)",\s+"emailAddress": "(.*?)",\s+"phoneNumber": "(.*?)"/g;
//         const contactInfoMatch = contactInfoRegex.exec(analysisResult);

//         if (contactInfoMatch && contactInfoMatch.length > 1) {
//             const name = contactInfoMatch[1];
//             const email = contactInfoMatch[2];
//             const phoneNumber = contactInfoMatch[3];
//             report.contactInfo = { name, email, phoneNumber };
//         } else {
//             throw new Error('Contact info not found in analysis result');
//         }

//         return report;

//     } catch (error) {
//         console.error('Error generating report: ', error);
//         throw new Error(error.message || 'Failed to generate report');
//     }
// }

// module.exports = { analyzeResume, generateReport };