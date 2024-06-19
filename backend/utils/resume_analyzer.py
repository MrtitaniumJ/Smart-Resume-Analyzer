import sys
import json
import logging
import traceback
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.tokenize import sent_tokenize
from nltk.tag import pos_tag
from nltk.chunk import ne_chunk
from collections import Counter
import spacy
from spacy.matcher import Matcher
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

# English model for spacy
nlp = spacy.load('en_core_web_sm')

# Logging configuration
logging.basicConfig(level=logging.DEBUG, filename='resume_analyzer.log', filemode='w', format='%(asctime)s - %(levelname)s - %(message)s')

def extract_contact_information(text):
    matcher = Matcher(nlp.vocab)
    
    # Patterns for contact information
    phone_pattern = [{"SHAPE": "ddd"}, {"SHAPE": "ddd"}, {"SHAPE": "dddd"}]
    email_pattern = [{"LIKE_EMAIL": True}]
    
    # Patterns for the matcher
    matcher.add("PHONE_NUMBER", [phone_pattern])
    matcher.add("EMAIL", [email_pattern])
    
    doc = nlp(text)
    matches = matcher(doc)
    
    contact_info = {"phone_numbers": [], "emails": []}
    
    for match_id, start, end in matches:
        if nlp.vocab.strings[match_id] == "PHONE_NUMBER":
            contact_info["phone_numbers"].append(doc[start:end].text)
        elif nlp.vocab.strings[match_id] == "EMAIL":
            contact_info["emails"].append(doc[start:end].text)
    
    return contact_info

def extract_education(text):
    # Education related keywords
    education_keywords = ['education', 'qualification', 'degree']
    
    # Split text into sentences
    sentences = sent_tokenize(text)
    
    # Sentences containing education-related keywords
    education_sentences = []
    for sentence in sentences:
        if any(keyword in sentence.lower() for keyword in education_keywords):
            education_sentences.append(sentence)
            
    # Performing named entity recognition (NER) on education sentences
    education_info = []
    for sentence in education_sentences:
        doc = nlp(sentence)
        for ent in doc.ents:
            if ent.label_ == 'ORG' or ent.label_ == 'DATE':
                education_info.append(ent.text)
                
    return education_info

def extract_experience(text):
    # Experience-related keywords
    experience_keywords = ['experience', 'work', 'employment', 'career']
    
    # Split text into sentences
    sentences = sent_tokenize(text)
    
    # Sentences containing experience-related keywords
    experience_sentences = []
    for sentence in sentences:
        if any(keyword in sentence.lower() for keyword in experience_keywords):
            experience_sentences.append(sentence)
            
    # Extract noun phrases containing job titles and company names
    experience_info = []
    for sentence in experience_sentences:
        doc = nlp(sentence)
        for chunk in doc.noun_chunks:
            if 'work' in chunk.text.lower() or 'experience' in chunk.text.lower():
                experience_info.append(chunk.text)
                
    return experience_info

def extract_skills(text):
    # Skill-related keywords
    skill_keywords = ['skill', 'proficiency', 'competency']
    
    # Split text into sentences
    sentences = sent_tokenize(text)
    
    # Find sentences containing skill-related keywords
    skill_sentences = []
    for sentence in sentences:
        if any(keyword in sentence.lower() for keyword in skill_keywords):
            skill_sentences.append(sentence)
            
    # Extract verbs and adjectives as skills using POS tagging
    skills = []
    for sentence in skill_sentences:
        tokens = word_tokenize(sentence)
        tagged_tokens = pos_tag(tokens)
        for word, tag in tagged_tokens:
            if tag.startswith('VB') or tag.startswith('JJ'):
                skills.append(word)
                
    return skills

# Similarity analysis between resume and job description
def calculate_similarity(resume_text, job_description):
    # Tokenize the text
    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform([resume_text, job_description])
        
    # Calculate cosine similarity
    similarity_score = cosine_similarity(vectors)[0,1]
        
    return similarity_score

def main():
    try:
        # Read arguments from command line
        resume_content = sys.argv[1]
        job_description = sys.argv[2]
        
        # Debug
        logging.debug(f"Resume content: {resume_content}")
        logging.debug(f"Job description: {job_description}")
        
        # Extract contact information from resume
        contact_info = extract_contact_information(resume_content)
        
        # Extract education information from resume
        education_info = extract_education(resume_content)
        
        # Extract experience information
        experience_info = extract_experience(resume_content)
        
        # Extract skills
        skills_info = extract_skills(resume_content)
        
        # Similarity analysis
        similarity_score = calculate_similarity(resume_content, job_description)
        
        # Prepare analysis results
        analysis_results = {
            "contact_information": contact_info,
            "education_information": education_info,
            "experience_information": experience_info,
            "skills_information": skills_info,
            "similarity_score": similarity_score
        }
        
        # Print analysis results as JSON
        print(json.dumps(analysis_results))
    except Exception as e:
        # Log exception traceback
        logging.error("An error occurred:")
        logging.error(traceback.format_exc())
        
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
