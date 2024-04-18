const Resume = require('../models/resume');
const fs = require('fs');
const path = require('path');
const { analyzeResume } = require('../utils/resumeAnalyzer');
const pdfParse = require('pdf-parse');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const { NlpManager } = require('node-nlp');
const resume = require('../models/resume');

const uploadDir = path.join(__dirname, '..', 'uploads');

class ResumeService {
    constructor() {
        this.manager = new NlpManager({ languages: ['en'] });
    }

    async extractTextFromPDF(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfText = await pdfParse(dataBuffer);
            return pdfText.text.toLowerCase();
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw new Error('Failed to extract text from PDF');
        }
    }

    preprocessText(text) {
        const cleanedText = text.replace(/[^\w\s]/gi, '');
        const normalizedText = cleanedText.replace(/\s+/g, ' ').trim();
        return normalizedText;
    }

    extractKeywords(text) {
        try {
            if (!text || text.trim() === '') {
                throw new Error('Invalid input: Text is undefined');
            }

            const words = tokenizer.tokenize(text);

            const stopWords = new Set(natural.stopwords);
            const filteredWords = words.filter((word)=> {
                word=word.toLowerCase();
                !stopWords.has(word);
            });

            const wordFreq = {};
            filteredWords.forEach(word => {
                if (wordFreq[word]) {
                    wordFreq[word]++;
                } else {
                    wordFreq[word] = 1;
                }
            });

            const sortedWords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);
            const numKeywords = Math.min(10, sortedWords.length);
            const keywords = sortedWords.slice(0, numKeywords);

            return keywords;
        } catch (error) {
            console.error('Error extracting keywords:', error);
            throw new Error('Failed to extract keywords');
        }
    }

    calculateSimilarity(resumeKeywords, jobKeywords) {
        const intersection = resumeKeywords.filter(keyword => jobKeywords.includes(keyword));
        const similarity = intersection.length / Math.sqrt(resumeKeywords.length * jobKeywords.length);
        return similarity;
    }

    assessSkills(resumeKeywords, jobKeywords) {
        const matchedSkills = resumeKeywords.filter(keyword => jobKeywords.includes(keyword));
        const unmatchedSkills = jobKeywords.filter(keyword => !resumeKeywords.includes(keyword));
        return { matchedSkills, unmatchedSkills };
    }

    analyzeExperienceAndEducation(resumeText) {
        const educationPattern = /(?<=Education|Qualifications|Degree)(.*?)(?=(Experience|Work))/gis;
        const experiencePattern = /(?<=Experience|Work)(.*?)(?=(Education|Qualifications))/gis;

        const educationMatches = resumeText.match(educationPattern);
        const experienceMatches = resumeText.match(experiencePattern);

        let educationDetails = {};
        if (educationMatches) {
            educationMatches.forEach((eduMatch, index) => {
                const educationInfo = this.extractEducationInfo(eduMatch);
                educationDetails[`education${index + 1}`] = educationInfo;
            });
        }

        let workExperience = {};
        if (experienceMatches) {
            const experienceInfo = this.extractExperienceInfo(experienceMatches[0]);
            workExperience.totalWorkExperience = experienceInfo;
        }

        return { education: educationDetails, workExperience: workExperience };
    }

    extractEducationInfo(educationText) {
        const degreePattern = /(?:Degree|Certificate|Diploma|Education)(.*?)(?:(?:in|at|from)|\d{4})/i;
        const schoolPattern = /(?:(?:from|at|in)\s)(.*?)(?:(?:\,|\n))/i;
        const yearPattern = /(\d{4})/;

        const degreeMatch = educationText.match(degreePattern);
        const schoolMatch = educationText.match(schoolPattern);
        const yearMatch = educationText.match(yearPattern);

        const degree = degreeMatch ? degreeMatch[1].trim() : null;
        const school = schoolMatch ? schoolMatch[1].trim() : null;
        const year = yearMatch ? yearMatch[1] : null;

        return { degree, school, passingYear: year };
    }

    extractExperienceInfo(experienceText) {
        const yearPattern = /\b\d+\s*(?:years?|yrs?)\b/i;
        const monthPattern = /\b\d+\s*(?:months?)\b/i;

        let totalExperience = "Unknown";

        const yearMatch = experienceText.match(yearPattern);
        const monthMatch = experienceText.match(monthPattern);

        if (yearMatch && monthMatch) {
            const years = parseInt(yearMatch[0]);
            const months = parseInt(monthMatch[0]);
            totalExperience = `${years} years and ${months} months`;
        } else if (yearMatch) {
            const years = parseInt(yearMatch[0]);
            totalExperience = `${years} years`;
        } else if (monthMatch) {
            const months = parseInt(monthMatch[0]);
            totalExperience = `${months} months`;
        }

        return totalExperience;
    }

    extractMatches(text, regex) {
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push(match[1].trim());
        }
        return matches;
    }

    async trainModel() {
        this.manager.addDocument('en', 'resume', 'resume', 'Resume');
        this.manager.addDocument('en', 'job description', 'job', 'Job Description');
        this.manager.addAnswer('en', 'resume', 'Resume analysis is performed.', 0.5);
        this.manager.addAnswer('en', 'job', 'Job description analysis is performed.', 0.5);
        await this.manager.train();
    }

    async performSemanticAnalysis(resumeText, jobDescription) {
        try {
            this.manager.addDocument('en', resumeText, 'resume', resumeText);
            this.manager.addDocument('en', jobDescription, 'jobDescription', jobDescription);

            await this.manager.train();

            const resumeIntent = await this.manager.process('en', resumeText);
            const jobDescriptionIntent = await this.manager.process('en', jobDescription);

            const jobDescriptionConcepts = jobDescriptionIntent.classifications.map(c => c.label);
            const resumeConcepts = {};
            resumeIntent.classifications.forEach(c => {
                const utterance = c.utterance || resumeText;
                if (resume[c.label]) {
                    resumeConcepts[c.label].push(utterance.split(' '));
                } else {
                    resumeConcepts[c.label] = [utterance.split(' ')];
                }
            });

            const conceptMatch = {};
            for (const concept of jobDescriptionConcepts) {
                conceptMatch[concept] = [];
                for (const [category, utterances] of Object.entries(resumeConcepts)) {
                    if (utterances && utterances.some(u => u.some(k => jobDescriptionConcepts.includes(k)))) { // Check if keywords is defined
                        conceptMatch[concept].push(`${category} (partial match)`);
                    }
                }
                if (conceptMatch[concept].length === 0) {
                    conceptMatch[concept].push(`not directly mentioned`);
                }
            }

            const semanticAnalysis = {
                jobDescriptionConcepts,
                resumeConcepts,
                conceptMatch
            };

            return semanticAnalysis;
        } catch (error) {
            console.error('Error performing semantic analysis:', error);
            throw new Error('Failed to perform semantic analysis');
        }
    }

    generateReport(analysisResults) {
        try {
            const report = {
                message: "Resume analysis completed",
                analysis: analysisResults
            };

            return report;
        } catch (error) {
            console.error('Error generating report:', error);
            throw new Error('Failed to generate report');
        }
    }

    async uploadResume(userId, filePath) {
        try {
            const filename = path.basename(filePath);
            const resumeText = await this.extractTextFromPDF(filePath);
            const preprocessedText = this.preprocessText(resumeText);
            const keywords = this.extractKeywords(preprocessedText);

            const resume = new Resume({
                userId: userId,
                filename: filename,
                path: filePath,
                content: preprocessedText,
                keywords: keywords
            });
            await resume.save();
            return resume;
        } catch (error) {
            console.error('Error uploading resume:', error);
            throw new Error('Failed to upload resume to the database');
        }
    }

    async analyzeResume(resumeId, jobDescription) {
        try {
            const resume = await this.getResumeById(resumeId);
            if (!resume) {
                throw new Error('Resume not found');
            }

            const resumeContent = resume.content;
            const resumeKeywords = this.extractKeywords(resumeContent);
            const jobKeywords = this.extractKeywords(jobDescription);

            const similarityScore = this.calculateSimilarity(resumeKeywords, jobKeywords);
            const skillAssessment = this.assessSkills(resumeKeywords, jobKeywords);
            const experienceAndEducationAnalysis = this.analyzeExperienceAndEducation(resumeContent);
            const semanticAnalysis = await this.performSemanticAnalysis(resumeContent, jobDescription);

            const workExperience = experienceAndEducationAnalysis.workExperience || {};
            const workExperienceScore = this.calculateWorkExperienceScore(workExperience);

            const analysisResults = {
                contactInfo: resume.contactInfo,
                jobTitle: resume.jobTitle,
                education: experienceAndEducationAnalysis.education,
                workExperience: experienceAndEducationAnalysis.workExperience,
                skills: {
                    hardSkills: {
                        matched: skillAssessment.matchedSkills,
                        unmatched: skillAssessment.unmatchedSkills
                    },
                    softSkills: {
                        matched: this.extractSoftSkills(resumeContent),
                        unmatched: this.extractSoftSkills(jobDescription)
                    }
                },
                semanticAnalysis,
                scoring: {
                    similarityScore: {
                        weightPerSkill: {
                            High: 0.7,
                            Medium: 0.3,
                            Low: 0.1
                        },
                        calculation: {
                            matchedSkillsWeight: {
                                High: 2,
                                Medium: 0.3
                            },
                            totalJobDescriptionWeight: 3,
                            score: similarityScore
                        }
                    },
                    overallScore: {
                        weights: {
                            similarityScore: 0.6,
                            workExperience: 0.2,
                            education: 0.1,
                            softSkills: 0.1
                        },
                        calculation: {
                            similarityScore,
                            workExperienceScore: this.calculateWorkExperienceScore(experienceAndEducationAnalysis.workExperience),
                            educationScore: this.calculateEducationScore(experienceAndEducationAnalysis.education),
                            // softSkillsScore: this.calculateSkillsScore(
                            //     this.extractSoftSkills(resumeContent),
                            //     this.extractSoftSkills(jobDescription)
                            // )
                        }
                    },
                    //suggestedCourses: this.generateSuggestedCourses(semanticAnalysis.jobDescriptionConcepts)
                }
            };

            const analysisReport = this.generateReport(analysisResults);

            resume.analyzed = true;
            resume.analysisReport = analysisReport;
            await resume.save();

            return analysisReport;
        } catch (error) {
            console.error('Error analyzing resume:', error);
            throw new Error('Failed to analyze resume');
        }
    }

    extractSoftSkills(text) {
        const softSkills = ["Leadership", "Teamwork", "Critical Thinking", "Logic Building"];
        const extractedSkills = [];

        for (const skill of softSkills) {
            const regex = new RegExp(`\\b${skill}\\b`, 'i');
            if (regex.test(text)) {
                extractedSkills.push(skill);
            }
        }

        return extractedSkills;
    }

    calculateWorkExperienceScore(workExperience) {
        try {
            if (!workExperience || !workExperience.totalWorkExperience) {
                console.error('Work experience data is missing or undefined');
                return 0;
            }
    
            const experienceText = workExperience.totalWorkExperience.toLowerCase();
            const yearPattern = /\b\d+\s*(?:years?|yrs?)\b/i;
            const monthPattern = /\b\d+\s*(?:months?)\b/i;
            let totalExperience = 0;
    
            const yearMatch = experienceText.match(yearPattern);
            const monthMatch = experienceText.match(monthPattern);
    
            if (yearMatch) {
                totalExperience += parseInt(yearMatch[0]);
            }
            if (monthMatch) {
                totalExperience += parseInt(monthMatch[0]) / 12;
            }
    
            const scoringRanges = [
                { min: 0, max: 1, score: 0.1 },
                { min: 1, max: 3, score: 0.5 },
                { min: 3, max: 5, score: 0.8 },
                { min: 5, max: Infinity, score: 1 }
            ];
    
            const matchingRange = scoringRanges.find(range => totalExperience >= range.min && totalExperience < range.max);
    
            return matchingRange ? matchingRange.score : 0;
        } catch (error) {
            console.error('Error calculating work experience score:', error);
            return 0;
        }
    }
    
    calculateEducationScore(education) {
        try {
            if (!education) {
                console.error('Education data is missing or undefined');
                return 0;
            }
    
            let educationScore = 0;
    
            const highestEducation = Object.values(education).reduce((highest, edu) => {
                if (!highest || highest.degree.toLowerCase() < edu.degree.toLowerCase()) {
                    return edu;
                }
                return highest;
            }, null);
    
            if (highestEducation) {
                switch (highestEducation.degree.toLowerCase()) {
                    case "phd":
                        educationScore = 1;
                        break;
                    case "master's degree":
                        educationScore = 0.8;
                        break;
                    case "bachelor's degree":
                        educationScore = 0.6;
                        break;
                    default:
                        educationScore = 0.4;
                        break;
                }
            }
            
            return educationScore;
        } catch (error) {
            console.error('Error calculating education score:', error);
            return 0;
        }
    }    

    getEducationScore(degree) {
        if (degree.toLowerCase().includes("phd")) {
            return 1.0;
        } else if (degree.toLowerCase().includes("master")) {
            return 0.9;
        } else if (degree.toLowerCase().includes("bachelor")) {
            return 0.8;
        } else {
            return 0.7;
        }
    }

    async getResumeById(resumeId) {
        try {
            const resume = await Resume.findById(resumeId);
            return resume;
        } catch (error) {
            console.error('Error fetching resume:', error);
            throw new Error('Failed to fetch resume');
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

    async updateAnalysisReport(resumeId, analysisReport) {
        try {
            if (!Mongoose.Types.ObjectId.isValid(resumeId)) {
                throw new Error('Invalid resumeId');
            }
            const updatedResume = await Resume.findByIdAndDelete(resumeId, { $set: { analysisReport } }, { new: true });
            if (!updatedResume) {
                throw new Error('Resume not found');
            }
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