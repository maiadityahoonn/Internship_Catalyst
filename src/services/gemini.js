import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GEMINI_API_KEY || ""
);

/**
 * Analyzes the skill gap between a user's current skills and their target role.
 * Returns a structured JSON response with match score, missing skills,
 * a learning roadmap, and project recommendations.
 */
export async function analyzeSkillGap(currentSkills, targetRole) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert career coach and technical recruiter. Analyze the skill gap between a candidate's current skills and their target role.

CURRENT SKILLS: ${currentSkills}
TARGET ROLE: ${targetRole}

Respond ONLY with a valid JSON object (no markdown, no code fences, no extra text). Use this exact structure:

{
  "matchScore": <number 0-100>,
  "matchedSkills": [
    { "name": "<skill>", "level": "<Beginner|Intermediate|Advanced>" }
  ],
  "missingSkills": [
    { "name": "<skill>", "priority": "<Critical|Important|Nice to Have>", "reason": "<why this skill matters for the role>" }
  ],
  "roadmap": [
    {
      "week": "Week 1-2",
      "title": "<phase title>",
      "tasks": ["<specific task 1>", "<specific task 2>", "<specific task 3>"],
      "goal": "<what the candidate should achieve by end of this phase>"
    }
  ],
  "projectIdeas": [
    {
      "title": "<project name>",
      "description": "<1 line description>",
      "skillsCovered": ["<skill1>", "<skill2>"],
      "difficulty": "<Beginner|Intermediate|Advanced>"
    }
  ],
  "topRecommendation": "<One powerful sentence of career advice specific to this gap>"
}

RULES:
- matchedSkills: only include skills from the user's list that are relevant to the target role.
- missingSkills: list 4-8 skills the candidate needs but doesn't have. Be specific (e.g., "React.js" not just "JavaScript framework").
- roadmap: provide exactly 4 phases (e.g., Week 1-2, Week 3-4, Week 5-6, Week 7-8).
- projectIdeas: suggest exactly 3 unique, real-world projects that would help fill the gap.
- Be practical, modern, and industry-relevant. Think like a hiring manager at a top tech company.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean any markdown fences if present
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error("Gemini response parse error:", err, text);
        throw new Error("AI returned an invalid response. Please try again.");
    }
}

/**
 * Generates resume content based on the requested type.
 * types: 'summary', 'experience', 'project', 'skills'
 */
export async function generateResumeContent(type, data) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = "";

    if (type === 'summary') {
        prompt = `Write a professional resume summary for a candidate with the following details:
Job Title/Education: ${data.title}
Experience Level: ${data.level}
Key Skills: ${data.skills || "relevant industry skills"}

Keep it concise (2-3 sentences), impactful, and ATS-friendly. No markdown.`;
    } else if (type === 'experience') {
        prompt = `Write 3-4 powerful, action-oriented bullet points for a ${data.role} role at ${data.company}.
Focus on these keywords/achievements: ${data.keywords || "general responsibilities"}.
Use robust action verbs and quantify results where possible. Return ONLY the bullet points as a plain text list (no markdown bullets).`;
    } else if (type === 'project') {
        prompt = `Write a compelling 2-sentence description for a project titled "${data.title}" built using ${data.tech || "modern technologies"}.
Focus on the technical implementation and the impact/solution. No markdown.`;
    } else if (type === 'skills') {
        prompt = `Suggest 10 relevant technical and soft skills for a ${data.role} role. 
Return them as a comma-separated list. No markdown.`;
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (err) {
        console.error("Gemini generation error:", err);
        throw new Error("Failed to generate content.");
    }
}

/**
 * Generates a highly personalized, competitive cover letter by matching
 * the user's experience with a specific job description.
 */
export async function generateCoverLetter(data) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an elite career strategist and expert copywriter. Your goal is to write a cover letter that doesn't just "list skills," but tells a compelling story that makes the candidate the OBVIOUS choice for the role.

CANDIDATE NAME: ${data.name}
TARGET COMPANY: ${data.company}
TARGET ROLE: ${data.role}
USER EXPERIENCE/ACHIEVEMENTS: ${data.experience}
JOB DESCRIPTION (JD): ${data.jd}
TONE: ${data.tone}

Respond ONLY with a valid JSON object (no markdown, no code fences, no extra text). Use this exact structure:

{
  "letter": "<The full formatted cover letter text. Use \\n for new lines.>",
  "analysis": [
    { "point": "<Key JD requirement addressed>", "how": "<How the letter specifically mirrors this requirement>" }
  ],
  "competitiveEdge": "<One paragraph explaining why this specific letter will beat 90% of other applicants for this role.>"
}

RULES FOR THE LETTER:
1. DO NOT use generic phrases like "I am writing to apply for." Start with a hook.
2. If JD is provided, extract specific pain points/requirements and address them directly.
3. Mirror the requested TONE:
   - Professional: Balanced, confident, industry-standard.
   - Passionate: High energy, mission-driven, startup-ready.
   - Analytical: Data-driven, focused on metrics and logic.
   - Bold: Disruptive, unconventional, shows peak confidence.
4. Focus on IMPACT (numbers, results) rather than just duties.
5. Keep it length-appropriate (approx 250-400 words).

RULES FOR ANALYSIS:
- Point: Find 3-5 specific keywords or requirements from the JD that the letter incorporates.
- How: Explain the strategy used to address that point.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean any markdown fences if present
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error("Gemini cover letter parse error:", err, text);
        throw new Error("AI returned an invalid response. Please try again.");
    }
}

/**
 * Performs deep semantic ATS analysis by matching a resume against a JD.
 * Audits formatting, keyword matching, and impact analysis.
 */
export async function analyzeATS(resumeText, jdText) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an elite Applicant Tracking System (ATS) algorithm and a senior technical recruiter. Your goal is to provide a brutal, honest, and highly technical audit of a candidate's resume against a Job Description (JD).

RESUME TEXT: ${resumeText}
JOB DESCRIPTION: ${jdText}

Respond ONLY with a valid JSON object (no markdown, no code fences, no extra text). Use this exact structure:

{
  "score": <number 0-100>,
  "semanticMatches": [
    { "concept": "<Matched Concept>", "relevance": "<High|Medium|Low>", "detail": "<brief explanation of matching evidence>" }
  ],
  "keywordGap": [
    { "keyword": "<Missing or Weak Keyword>", "importance": "<Critical|Optional>", "fix": "<specific actionable advice>" }
  ],
  "formattingAudit": {
    "score": <0-100>,
    "issues": ["<Issue 1>", "<Issue 2>"],
    "isSafe": <boolean>
  },
  "impactScore": <0-100>,
  "boostMyScore": [
    { "original": "<Current weak line from resume>", "suggested": "<Powerful, quantified rewrite>", "reason": "<why this improves score>" }
  ],
  "summary": "<Overall summary of compatibility and chances of passing human review>"
}

RULES:
1. SEMANTIC MATCHING: Look beyond exact keywords. If the JD asks for "Concurrent programming" and the resume says "Multithreading/Go channels," that's a match.
2. FORMATTING AUDIT: Detect if the text looks messy (parsing errors), has columns that might fail, or is missing clear headers.
3. BOOST MY SCORE: This is the most important part. provide 3-5 specific rewrites of actual lines from the resume.
4. If JD is empty, analyze resume for general "Senior Software Engineer" industry standards.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean any markdown fences if present
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error("Gemini ATS analysis parse error:", err, text);
        throw new Error("AI returned an invalid response. Please try again.");
    }
}
