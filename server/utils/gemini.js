const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not set. AI evaluation will fail.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");

const getGeminiResponse = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Strip out markdown code blocks if the structural output puts it inside "```json ... ```"
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
};

const templates = {
    resumePrompt: (resumeText, targetRole) => `
    You are an expert technical recruiter analyzing a student's resume.
    Role targeted: ${targetRole || 'Software Engineer'}

    Resume Text:
    ${resumeText}

    Extract and evaluate the resume based on the following JSON schema strictly! No markdown blocks, just raw JSON.
    {
      "atsScore": 65, // out of 100
      "formattingScore": 70, // out of 100
      "missingKeywords": ["Docker", "AWS"], // List 3-5 critical keywords missing for the selected role
      "weakSections": ["Projects lack technical depth", "Resume summary is too generic"], // List 1-3 improvements
      "overallFeedback": "Your resume has good foundational skills but lacks quantifiable metrics."
    }
    `,

    githubPrompt: (githubData, targetRole) => `
    You are a Senior Engineering Manager assessing a student's GitHub profile.
    Target Role: ${targetRole || 'Software Engineer'}

    GitHub Summary Data:
    Public Repos: ${githubData.public_repos}
    Followers: ${githubData.followers}
    Recent Repos: ${JSON.stringify(githubData.recentRepos)}

    Assess the portfolio based on the target role. Return raw JSON matching this schema:
    {
      "portfolioScore": 60, // out of 100
      "strengths": ["Good variety of projects", "Active in recent months"],
      "weaknesses": ["Missing READMEs", "No deployment links"],
      "feedback": "Try to add detailed READMEs with screenshots to your projects."
    }
    `,

    communicationPrompt: (transcript, metrics) => `
    You are a Communication Coach analyzing an interview answer.
    The user spoke for 30 seconds.
    Transcript: "${transcript}"
    Metrics: ${JSON.stringify(metrics)} (Note: high hesitation/pauses means lower confidence)

    Return raw JSON matching this schema:
    {
      "communicationScore": 75, // out of 100
      "confidence": "Medium", // High/Medium/Low
      "grammarIssues": ["Used 'like' too much", "Sentence structure was fragmented"],
      "feedback": "You sounded a bit nervous, try to slow down your speaking pace."
    }
    `,

    finalizePrompt: (allScores, targetRole) => `
    You are an AI Career Coach. Generate a final interview readiness evaluation and a personalized improvement plan.
    Target Role: ${targetRole || 'Software Engineer'}
    Scores out of 100:
    Resume: ${allScores.resumeScore}
    Technical Quiz: ${allScores.quizScore}
    Communication: ${allScores.communicationScore}
    Portfolio (GitHub): ${allScores.portfolioScore}
    Overall Calculated Readiness: ${allScores.overallScore}

    Provide a tailored markdown improvement roadmap and brief summary. Return raw JSON matching this schema:
    {
      "summary": "You are intermediate. You show promise in technical concepts but lack portfolio strength.",
      "readinessLevel": "Intermediate", // Beginner, Intermediate, or Interview Ready
      "improvementPlan": ["Improve DBMS concepts by applying them in a project", "Add more backend projects with Node.js", "Resume lacks action verbs"]
    }
    `
};

module.exports = {
    getGeminiResponse,
    templates
};