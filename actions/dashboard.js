"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

/* -------------------------------------------------- */
/* 🔥 GROQ MODEL SETUP (Replaces Gemini) */
/* -------------------------------------------------- */

const model = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* -------------------------------------------------- */
/* 🔥 SAFE JSON PARSER */
/* -------------------------------------------------- */

function safeJsonParse(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI JSON Parse Error:", error);
    return null;
  }
}

/* -------------------------------------------------- */
/* 🔥 AI GENERATION */
/* -------------------------------------------------- */

export const generateAIInsights = async (industry) => {
  const prompt = `
You are an industry analyst AI.

Analyze the current state of the ${industry} industry.

Return ONLY valid JSON in this exact format:

{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "HIGH" | "MEDIUM" | "LOW",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

Rules:
- No markdown
- No explanations
- No extra text
- At least 5 salary roles
- At least 5 skills
- Growth rate must be percentage number only
`;

  try {
    const result = await model.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "user", content: prompt }
  ],
  temperature: 0.7,
});

    const text = result.choices[0].message.content;

    const parsed = safeJsonParse(text);

    if (!parsed) {
      throw new Error("Invalid AI JSON format");
    }

    return parsed;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate AI insights");
  }
};

/* -------------------------------------------------- */
/* 🔥 MAIN FUNCTION */
/* -------------------------------------------------- */

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industry: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.industry) {
    throw new Error("Industry insights not found. Please complete onboarding.");
  }

  return user.industry;
}