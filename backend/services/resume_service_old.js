const Resume = require('../models/resume');
const fs = require('fs');
const path = require('path');
const { analyzeResume } = require('../utils/resumeAnalyzer');
const pdfParse = require('pdf-parse');
const { extractKeywords } = require('./keywordExtractor');
const { computeMatchingScores } = require('./matchingAlgorithm');
const { analyzeSkills } = require('./skillAssessment');
const { analyzeExperienceAndEducation } = require('./experienceEducationAnalysis');
const { performSemanticAnalysis } = require('./semanticAnalysis');
const { generateReport } = require('./reportGeneration');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const { NlpManager } = require('node-nlp');

const uploadDir = path.join(__dirname, '..', 'uploads');

class ResumeService {
    constructor() {
        this.manager = new NlpManager({ languages: ['en'] });
    }

    async extractTextFromPDF(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfText = await pdfParse(dataBuffer);
            return pdfText.text;
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
            const filteredWords = words.filter(word => !stopWords.has(word.toLowerCase()));
    
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
        const dotProduct = resumeKeywords.reduce((acc, keyword) => {
            if (jobKeywords.includes(keyword)) {
                return acc + 1;
            }
            return acc;
        }, 0);

        const magnitudeResume = Math.sqrt(resumeKeywords.length);
        const magnitudeJob = Math.sqrt(jobKeywords.length);

        const similarity = dotProduct / (magnitudeResume * magnitudeJob);

        return similarity;
    }

    assessSkills(resumeKeywords, jobKeywords) {
        const skillAssessment = {
            matchedSkills: [],
            unmatchedSkills: []
        };

        for (const jobSkill of jobKeywords) {
            if (resumeKeywords.includes(jobSkill)) {
                skillAssessment.matchedSkills.push(jobSkill);
            } else {
                skillAssessment.unmatchedSkills.push(jobSkill);
            }
        }
        return skillAssessment;
    }

    analyzeExperienceAndEducation(resumeText) {
        const jobTitleRegex = /(?:job\s*title|position)\s*[:\-\s]?(.*?)(?:\n|$)/gi;
        const companyRegex = /(?:company|employer)\s*[:\-\s]?(.*?)(?:\n|$)/gi;
        const dateRegex = /(?:date\s*of\s*(?:employment|work))\s*[:\-\s]?(.*?)(?:\n|$)/gi;
        const educationRegex = /(?:education|qualification)\s*[:\-\s]?(.*?)(?:\n|$)/gi;

        const jobTitles = this.extractMatches(resumeText, jobTitleRegex);
        const companies = this.extractMatches(resumeText, companyRegex);
        const datesOfEmployment = this.extractMatches(resumeText, dateRegex);
        const educationQualifications = this.extractMatches(resumeText, educationRegex);

        return {
            jobTitles,
            companies,
            datesOfEmployment,
            educationQualifications
        };
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
            if (!this.manager.isReady) {
                await this.trainModel();
            }

            const resumeIntent = await this.manager.process('en', resumeText);
            const jobIntent = await this.manager.process('en', jobDescription);

            return {
                resumeIntent,
                jobIntent
            };
        } catch (error) {
            console.error('Error performing semantic analysis:', error);
            throw new Error('Failed to perform semantic analysis');
        }
    }

    generateReport(analysisResults) {
        try {
            const {
                contactInfo,
                jobTitle,
                educationMatch,
                sectionHeadings,
                dateFormatting,
                hardSkills,
                softSkills,
                overallScore,
                semanticAnalysis,
                similarityScore,
                skillAssessment,
                experienceAndEducationAnalysis,
                suggestedCourses
            } = analysisResults;

            const report = {
                contactInfo,
                jobTitle,
                educationMatch,
                sectionHeadings,
                dateFormatting,
                skills: {
                    hardSkills,
                    softSkills
                },
                overallScore,
                semanticAnalysis: semanticAnalysis,
                similarityScore,
                skillAssessment,
                experienceAndEducationAnalysis,
                suggestedCourses
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
            const resume = await Resume.findById(resumeId);
            if (!resume) {
                throw new Error('Resume not found');
            } 

            if (!resume.content || !resume.content.trim()) {
                throw new Error('Resume content is empty or undefined');
            }

            if (!jobDescription || !jobDescription.trim()) {
                throw new Error('Job description is empty or undefined');
            }

            const resumeContent = resume.content;
    
            const resumeKeywords = this.extractKeywords(resumeContent);
            const jobKeywords = this.extractKeywords(jobDescription);
    
            const similarityScore = this.calculateSimilarity(resumeKeywords, jobKeywords);
            const skillAssessment = this.assessSkills(resumeKeywords, jobKeywords);
            const experienceAndEducationAnalysis = this.analyzeExperienceAndEducation(resumeContent);
            const semanticAnalysis = await this.performSemanticAnalysis(resumeContent, jobDescription);
            const report = this.generateReport({
                similarityScore,
                skillAssessment,
                experienceAndEducationAnalysis,
                semanticAnalysis
            });
    
            resume.analyzed = true;
            resume.analysisReport = report;
            await resume.save();
            return report;
        } catch (error) {
            console.error('Error analyzing resume:', error);
            throw new Error('Failed to analyze resume');
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