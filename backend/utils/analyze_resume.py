import os
import nltk
import re
import spacy
from datetime import datetime
from collections import Counter
from pdfminer.high_level import extract_text
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class AnalyzeResume:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        nltk.download('stopwords')
        
        self.common_soft_skills = [
            "communication", "teamwork", "time management", "leadership", "adaptability", 
            "problem-solving", "creativity", "emotional intelligence", "critical thinking"
        ]
        self.stop_words = set(stopwords.words('english'))
        
    def preprocess_text(self, text):
        text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
        text = re.sub(r'\s+', ' ', text).strip()  # Remove extra whitespaces
        return text
    
    def extract_section_headings(self, resume_text):
        headings = re.findall(r'\n\s*([A-Z][a-z\s]+):', resume_text)
        return headings
    
    def check_date_formatting(self, resume_text):
        date_pattern = r'(?:\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b)'
        date_formats = re.findall(date_pattern, resume_text)
        return date_formats
    
    def analyze_soft_skills(self, resume_text):
        words = word_tokenize(resume_text.lower())
        filtered_words = [word for word in words if word not in self.stop_words and len(word) > 1]
        
        soft_skills = []
        
        for word in filtered_words:
            if word in self.common_soft_skills:
                soft_skills.append(word)
                
        soft_skills = list(set(soft_skills))
        return soft_skills
    
    def calculate_similarity(self, resume_text, job_description):
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity_score = cosine_similarity(tfidf_matrix[0, tfidf_matrix[1]])[0][0]
        return similarity_score
    
    def generate_report(self, resume_text, job_description, contact_info, job_title):
        preprocessed_resume_text = self.preprocess_text(resume_text)
        preprocessed_job_description = self.preprocess_text(job_description)
        
        section_headings = self.extract_section_headinds(resume_text)
        date_formatting = self.check_date_formatting(resume_text)
        soft_skills = self.analyze_soft_skills(resume_text)
        soft_skills = self.analyze_soft_skills(resume_text)
        similarity_score = self.calculate_similarity(preprocessed_resume_text, preprocessed_job_description)
        
        report = {
            "contact_info": contact_info,
            "job_title": job_title,
            "section_headings": section_headings,
            "date_formatting": date_formatting,
            "soft_skills": soft_skills,
            "similarity_score": similarity_score
        }
        return report
    
if __name__ == "__main__":
    resume_text = "Resume content goes here"
    job_description = "Job description goes here"
    contact_info = "Contact info goes here"
    job_title = "Job title"
    
    analyze_resume = AnalyzeResume()
    report = analyze_resume.generate(resume_text, job_description, contact_info, job_title)
    print(report)

    def extract_text_from_pdf(self, file_path):
        try:
            text = extract_text(file_path)
            return text
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            raise

    def preprocess_text(self, text):
        text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
        text = re.sub(r'\s+', ' ', text).strip()  # Remove extra whitespaces
        return text

    def extract_keywords(self, text):
        words = word_tokenize(text.lower())
        filtered_words = [word for word in words if word not in self.stop_words and len(word) > 1]
        keyword_counter = Counter(filtered_words)
        return keyword_counter.most_common(10)

    def calculate_similarity(self, resume_text, job_description):
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity_score = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
        return similarity_score

    def analyze_skills(self, resume_text, job_description):
        resume_skills = self.extract_keywords(resume_text)
        job_skills = self.extract_keywords(job_description)
        common_skills = [skill for skill, _ in resume_skills if skill in job_skills]
        return common_skills

    def extract_experience_and_education(self, resume_text):
        experience = []
        education = []
        # Regular expressions to match experience and education patterns
        experience_regex = r'((?:\b(?:work|working|experience|employed)\b[\w\s]*?)([a-zA-Z\s]*?)(?:\bat\b\s)?([a-zA-Z\s]+?)(?:[\s,]*?)([a-zA-Z]{3,}[\s\d]+?)(?:-|(?:\sto\s))([a-zA-Z]{3,}[\s\d]+?))'
        education_regex = r'((?:\b(?:education|qualifications|degree|diploma|certificate|school)\b[\w\s]*?)([a-zA-Z\s]+?)(?:\bin\b\s)?([a-zA-Z\s]+?)(?:,|[\s,]*?)([a-zA-Z]{3,}[\s\d]+?)(?:-|(?:\sto\s))([a-zA-Z]{3,}[\s\d]+?))'
        # Extracting experience
        experience_matches = re.findall(experience_regex, resume_text, re.IGNORECASE)
        for match in experience_matches:
            job_title = match[1].strip()
            company_name = match[2].strip()
            start_date = match[3].strip()
            end_date = match[4].strip()
            experience.append({"job_title": job_title, "company_name": company_name, "start_date": start_date, "end_date": end_date})
        # Extracting education
        education_matches = re.findall(education_regex, resume_text, re.IGNORECASE)
        for match in education_matches:
            degree = match[1].strip()
            institution = match[2].strip()
            start_date = match[3].strip()
            end_date = match[4].strip()
            education.append({"degree": degree, "institution": institution, "start_date": start_date, "end_date": end_date})
        return experience, education

    def match_education(self, job_description, education_in_resume):
        job_desc_doc = self.nlp(job_description.lower())
        edu_resume_doc = self.nlp(education_in_resume.lower())
        
        job_desc_education = [ent.text for ent in job_desc_doc.ents if ent.label_ == "EDUCATION"]
        
        matched_education = [edu for edu in edu_resume_doc if edu.text in job_desc_education]
        
        return matched_education
    
    def extract_section_headinds(self, resume_text):
        headings = re.findall(r'\n\s*([A-Z][a-z\s]+):', resume_text)
        return headings
    
    def check_date_formatting(self, resume_text):
        date_pattern = r'(?:\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b)'
        date_formats = re.findall(date_pattern, resume_text)
        
        return date_formats

    def analyze_soft_skills(self, resume_text):
        words = nltk.word_tokenize(resume_text.lower())
        filtered_words = [word for word in words if word not in self.stop_words and len(word) > 1]
        
        soft_skills = []
        
        for word in filtered_words:
            if word in self.common_soft_skills:
                soft_skills.append(word)
                
        soft_skills = list(set(soft_skills))
        
        return soft_skills

    def calculate_overall_score(self, resume_text, job_description):
        # Placeholder logic for overall score calculation
        # Implement your logic to calculate an overall score based on different criteria
        overall_score = 0.75  # Example overall score
        return overall_score

    def perform_semantic_analysis(self, resume_text, job_description):
        # Placeholder logic for semantic analysis
        # Implement your logic to perform semantic analysis
        # For example, you can use pretrained models or NLP techniques
        # Here, we return a dummy result for demonstration
        return {"semantic_analysis_result": "Semantic analysis completed successfully"}

    def suggest_courses_based_on_skills(self, unmatched_skills):
        # Placeholder logic for suggesting courses based on unmatched skills
        # Implement your logic to suggest relevant courses based on unmatched skills
        # Here, we return a dummy result for demonstration
        suggested_courses = ["Python Programming Course", "Project Management Training"]  # Example suggested courses
        return suggested_courses

    def generate_report(self, resume_text, job_description, contact_info, job_title):
        preprocessed_resume_text = self.preprocess_text(resume_text)
        preprocessed_job_description = self.preprocess_text(job_description)

        keywords = self.extract_keywords(preprocessed_resume_text)
        similarity_score = self.calculate_similarity(preprocessed_resume_text, preprocessed_job_description)
        matched_skills = self.analyze_skills(preprocessed_resume_text, preprocessed_job_description)
        experience, education = self.extract_experience_and_education(preprocessed_resume_text)
        education_match = self.match_education(preprocessed_job_description, education)
        
        section_headings = self.extract_section_headings(resume_text)
        date_formatting = self.check_date_formatting(resume_text)
        soft_skills = self.analyze_soft_skills(resume_text)
        overall_score = self.calculate_overall_score(resume_text, job_description)
        semantic_analysis = self.perform_semantic_analysis(resume_text, job_description)
        suggested_courses = self.suggest_courses_based_on_skills(matched_skills) 

        report = {
            "contact_info": contact_info,
            "job_title": job_title,
            "education_match": education_match,
            "section_headings": section_headings,
            "date_formatting": date_formatting,
            "hard_skills": matched_skills,
            "soft_skills": soft_skills,
            "overall_score": overall_score,
            "semantic_analysis": semantic_analysis,
            "similarity_score": similarity_score,
            "experience_and_education": {"experience": experience, "education": education},
            "suggested_courses": suggested_courses
        }
        return report

def upload_resume(user_id, file_path):
    # Implement logic to upload resume
    pass

def analyze_resume(resume_id, job_description):
    analyze = AnalyzeResume()
    # Implement logic to fetch resume content and other necessary details
    resume_text = "Resume text fetched from database"  # Placeholder
    contact_info = "Contact info extracted from resume"  # Placeholder
    job_title = "Job title extracted from resume"  # Placeholder
    report = analyze.generate_report(resume_text, job_description, contact_info, job_title)
    # Implement logic to save analysis report to database
    pass
