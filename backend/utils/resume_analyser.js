exports.generateReport = (analysisResult) => {
    const { matched_skills, unmatched_skills, suggested_courses, match_rate } = analysisResult;

    const report = {
        matchedSkills: matched_skills,
        unmatchedSkills: unmatched_skills,
        suggestedCourses: suggested_courses,
        matchRate: match_rate
    };

    return report;
};