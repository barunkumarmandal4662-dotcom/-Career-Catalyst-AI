'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a user's resume
 * against a selected target career role to identify missing, important, and optional skills.
 *
 * - aiSkillGapAnalysis - A function that performs the AI skill gap analysis.
 * - AiSkillGapAnalysisInput - The input type for the aiSkillGapAnalysis function.
 * - AiSkillGapAnalysisOutput - The return type for the aiSkillGapAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TargetCareerRoleSchema = z.enum([
  'Backend Engineer',
  'Frontend Developer',
  'Full Stack Developer',
  'AI Engineer',
  'Data Analyst',
  'DevOps Engineer',
  'Cloud Engineer',
]);

const AiSkillGapAnalysisInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The extracted text content of the user\'s resume.'),
  targetRole: TargetCareerRoleSchema.describe(
    'The target career role selected by the user.'
  ),
});
export type AiSkillGapAnalysisInput = z.infer<
  typeof AiSkillGapAnalysisInputSchema
>;

const AiSkillGapAnalysisOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe('Skills that are required for the target role but are missing from the resume.'),
  importantSkills: z
    .array(z.string())
    .describe('Skills that are present in the resume and are highly relevant/important for the target role.'),
  optionalSkills: z
    .array(z.string())
    .describe('Skills that are present in the resume but are less critical or supplementary for the target role.'),
});
export type AiSkillGapAnalysisOutput = z.infer<
  typeof AiSkillGapAnalysisOutputSchema
>;

const aiSkillGapAnalysisPrompt = ai.definePrompt({
  name: 'aiSkillGapAnalysisPrompt',
  input: {schema: AiSkillGapAnalysisInputSchema},
  output: {schema: AiSkillGapAnalysisOutputSchema},
  prompt: `You are an expert career analyst. Your task is to compare a user's resume against the requirements for a specific target career role and identify skills in three categories.

Analyze the provided resume text and, based on your expert knowledge of the target role, identify the following:

1.  **Missing Skills**: Skills that are typically required or highly beneficial for the '{{{targetRole}}}' role but are not explicitly mentioned in the provided resume.
2.  **Important Skills**: Skills that are mentioned in the resume and are considered highly important or crucial for the '{{{targetRole}}}' role.
3.  **Optional Skills**: Skills that are mentioned in the resume but are less critical, supplementary, or generally useful (but not primary) for the '{{{targetRole}}}' role.

Resume Text:
---
{{{resumeText}}}
---

Target Role: {{{targetRole}}}

Provide the output in a JSON format matching the schema provided to you.`,
});

const aiSkillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'aiSkillGapAnalysisFlow',
    inputSchema: AiSkillGapAnalysisInputSchema,
    outputSchema: AiSkillGapAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await aiSkillGapAnalysisPrompt(input);
    return output!;
  }
);

export async function aiSkillGapAnalysis(
  input: AiSkillGapAnalysisInput
): Promise<AiSkillGapAnalysisOutput> {
  return aiSkillGapAnalysisFlow(input);
}
