const spacy = require('spacy');

const loadSpacyModel = async () => {
    return await spacy.load('en_core_web_sm');
};

exports.analyzeResume = async (resumeContent, jobDescription) => {
    try {
        const nlp = await loadSpacyModel();
        const resumeDoc = await nlp(resumeContent);
        const jobDescDoc = await nlp(jobDescription);

        const contactInfo = extractContactInfo(resumeDoc);
        const jobTitle = extractJobTitle(resumeDoc, jobDescDoc);
        const educationMatch = await checkEducationMatch(resumeDoc, jobDescDoc);
        const sectionHeadings = await extractSectionHeadings(resumeDoc);
        const dateFormatting = await checkDateFormatting(resumeDoc);
        const { hardSkills, softSkills } = await extractSkills(resumeDoc, jobDescDoc);
        const overallScore = calculateOverallScore(contactInfo, jobTitle, educationMatch, sectionHeadings, dateFormatting, hardSkills, softSkills);
        const suggestedCourses = suggestCourses(hardSkills, softSkills);

        return {
            contactInfo,
            jobTitle,
            educationMatch,
            sectionHeadings,
            dateFormatting,
            hardSkills,
            softSkills,
            overallScore,
            suggestedCourses
        };
    } catch (error) {
        console.error('Error analyzing resume: ', error);
        throw new Error('Failed to analyze resume');
    }
};

const extractContactInfo = (doc) => {
    const entities = doc.ents;
    const contactInfo = {
        email: extractEntity(entities, 'EMAIL'),
        phone: extractEntity(entities, 'PHONE'),
        address: extractEntity(entities, 'ADDRESS'),
        linkedin: extractEntity(entities, 'LINK'),
        website: extractEntity(entities, 'URL')
    };
    return contactInfo;
};

const extractJobTitle = (resumeDoc, jobDescDoc) => {
    const jobTitle = resumeDoc.ents.find(ent => ent.label_ === 'JOB_TITLE');
    const jobTitleMatch = jobDescDoc.text.toLowerCase().includes(jobTitle.text.toLowerCase());

    return { jobTitle, jobTitleMatch };
};

const checkEducationMatch = async (resumeDoc, jobDescDoc) => {
    const resumeEducation = extractEducation(resumeDoc);
    const jobDescEducation = extractEducation(jobDescDoc);

    const educationMatch = resumeEducation.some(resumeEdu => jobDescEducation.includes(resumeEdu));
    return educationMatch;
};

const extractEducation = (doc) => {
    const educationEntities = doc.ents.filter(ent => ent.label_ === 'EDUCATION');
    const educationInfo = educationEntities.map(entity => entity.text);
    return educationInfo;
};

const extractSectionHeadings = async (doc) => {
    try {
        await doc.ready();
        const sectionHeadings = [];
        for (const ent of doc.ents) {
            if (ent.label_ === 'SECTION_HEADING') {
                sectionHeadings.push(ent.text);
            }
        }

        return sectionHeadings;
    } catch (error) {
        console.error('Error extracting section headings:', error);
        throw new Error('Failed to extract section headings');
    }
};

const checkDateFormatting = async (doc) => {
    try {
        await doc.ready();

        const dateFormatRegex = /^(0[1-9]|1[0-2])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)\d\d$/;

        for (const ent of doc.ents) {
            if (ent.label_ === 'DATE') {
                if (!dateFormatRegex.test(ent.text)) {
                    return false;
                }
            }
        }
        return true;
    } catch (error) {
        console.error('Error checking date formatting:', error);
        throw new Error('Failed to check date formatting');
    }
};

const extractSkills = async (resumeDoc, jobDescDoc) => {
    try {
        await Promise.all([resumeDoc.ready(), jobDescDoc.ready()]);

        const hardSkills = extractHardSkills(resumeDoc);
        const softSkills = extractSoftSkills(jobDescDoc);

        return { hardSkills, softSkills };
    } catch (error) {
        console.error('Error extracting skills:', error);
        throw new Error('Failed to extract skills');
    }
};

const extractHardSkills = (doc) => {
    const techSkills = [];

    for (const token of doc.tokens) {
        if (token.entType === 'SKILL') {
            techSkills.push(token.text);
        }
    }
    return techSkills;
};

const extractSoftSkills = (doc) => {
    const softSkills = [];

    for (const token of doc.tokens) {
        if (token.entType === 'SOFT_SKILL') {
            softSkills.push(token.text);
        }
    }
    return softSkills;
};

const calculateOverallScore = (contactInfo, jobTitle, educationMatch, sectionHeadings, dateFormatting, hardSkills, softSkills) => {
    //placeholder implementation
    let score = 0;
    if (contactInfo.email && contactInfo.phone) score += 10;
    if (jobTitle.jobTitleMatch) score += 20;
    if (educationMatch) score += 15;
    if (sectionHeadings.length >= 3) score += 10;
    if (dateFormatting) score += 10;
    score += hardSkills.length * 2;
    score += softSkills.length * 2;
    return score;
};

const suggestCourses = (hardSkills, softSkills) => {
    const courses = [];

    hardSkills.forEach(skill => {
        switch (skill.toLowerCase()) {
            case 'javascript':
                courses.push({ name: 'JavaScript Basics', link: 'https://example.com/courses/javascript-basics' });
                courses.push({ name: 'Advanced JavaScript', link: 'https://example.com/courses/advanced-javascript' });
                break;
            case 'react':
                courses.push({ name: 'React Fundamentals', link: 'https://example.com/courses/react-fundamentals' });
                courses.push({ name: 'React Hooks Mastery', link: 'https://example.com/courses/react-hooks-mastery' });
                break;
            case 'node.js':
                courses.push({ name: 'Node.js Essentials', link: 'https://example.com/courses/node-js-essentials' });
                courses.push({ name: 'Express.js Crash Course', link: 'https://example.com/courses/express-js-crash-course' });
                break;
            //more cases for other hard skills as needed
        }
    });

    softSkills.forEach(skill => {
        switch (skill.toLowerCase()) {
            case 'communication':
                courses.push({ name: 'Effective Communication Skills', link: 'https://example.com/courses/effective-communication-skills' });
                break;
            case 'problem-solving':
                courses.push({ name: 'Problem-solving Strategies', link: 'https://example.com/courses/problem-solving-strategies' });
                break;
            case 'teamwork':
                courses.push({ name: 'Teamwork Essentials', link: 'https://example.com/courses/teamwork-essentials' });
                break;
            // Add more cases for other soft skills as needed
        }
    });
    return courses;
};

const extractEntity = (entities, entityType) => {
    const entity = entities.find(ent => ent.label_ === entityType);
    return entity ? entity.text : "";
};
