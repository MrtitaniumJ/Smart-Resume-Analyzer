import sys
import spacy

def analyze_resume(resume_tect, job_description):
    nlp = spacy.load('en_core_web_sm')
    resume_doc = nlp(resume_text)
    job_doc = nlp(job_description)
    
    matched_skills = []
    unmatched_skills = []
    suggested_courses = []
    
    for token in resume_doc:
        if token.text.lower() in job_doc.text.lower():
            matched_skills.append(token.text)
        else:
            unmatched_skills.append(token.text)
            
    match_rate = (len(matched_skills) / len(resume_doc)) * 100
    
    for skills in unmatched_skills:
        suggested_courses.append(f"Course in {skill}")
        
    return {
        "matched_skills": list(set(matched_skills)),
        "unmatched_skills": list(set(unmatched_skills)),
        "suggested_courses": suggested_courses,
        "match_rate": match_rate
    }
    
if __name__ == "__main__":
    resume_text = sys.argv[1]
    job_description = sys.argv[2]
    
    analysis_result = analyze_resume(resume_text, job_description)
    print(analysis_result)