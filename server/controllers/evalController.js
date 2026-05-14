const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const { getGeminiResponse, templates } = require('../utils/gemini');

exports.evaluateResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text;
        const { targetRole } = req.body;

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        const prompt = templates.resumePrompt(resumeText, targetRole);
        const aiResponse = await getGeminiResponse(prompt);

        res.json({ success: true, data: aiResponse });
    } catch (error) {
        console.error(error);
        // Fallback for hackathon demo if API fails
        res.json({
            success: false,
            data: { atsScore: 50, formattingScore: 60, missingKeywords: ["React", "System Design"], weakSections: ["Failed to parse properly"], overallFeedback: "Error processing resume." }
        });
    }
};

exports.evaluateGithub = async (req, res) => {
    try {
        const { githubUsername, targetRole } = req.body;
        if (!githubUsername) return res.status(400).json({ error: 'GitHub username required' });

        // Basic details
        const userRes = await axios.get(`https://api.github.com/users/${githubUsername}`);
        
        // Recent repos
        const reposRes = await axios.get(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`);
        const recentRepos = reposRes.data.map(r => ({
            name: r.name,
            language: r.language,
            has_description: !!r.description
        }));

        const githubData = {
            public_repos: userRes.data.public_repos,
            followers: userRes.data.followers,
            recentRepos
        };

        const prompt = templates.githubPrompt(githubData, targetRole);
        const aiResponse = await getGeminiResponse(prompt);

        res.json({ success: true, data: aiResponse });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            data: { portfolioScore: 40, strengths: ["Account exists"], weaknesses: ["Failed to fetch repository details"], feedback: "Ensure your GitHub has public repositories." }
        });
    }
};

exports.evaluateCommunication = async (req, res) => {
    try {
        const { transcript, metrics } = req.body;
        
        const prompt = templates.communicationPrompt(transcript, metrics);
        const aiResponse = await getGeminiResponse(prompt);

        res.json({ success: true, data: aiResponse });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            data: { communicationScore: 50, confidence: "Medium", grammarIssues: ["Could not process"], feedback: "Error processing transcript." }
        });
    }
};

exports.finalizeEvaluation = async (req, res) => {
    try {
        const { scores, targetRole } = req.body;
        // scores = { resumeScore, quizScore, communicationScore, portfolioScore }

        // Calculate overall baseline
        const overallScore = Math.round(
            (scores.resumeScore * 0.25) + 
            (scores.quizScore * 0.30) + 
            (scores.communicationScore * 0.25) + 
            (scores.portfolioScore * 0.20)
        );

        const prompt = templates.finalizePrompt({ ...scores, overallScore }, targetRole);
        const aiResponse = await getGeminiResponse(prompt);

        res.json({ 
            success: true, 
            data: {
                ...aiResponse,
                overallScore
            } 
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            data: { summary: "Error generating final plan.", readinessLevel: "Unknown", improvementPlan: ["Please try again later"], overallScore: 0 }
        });
    }
}