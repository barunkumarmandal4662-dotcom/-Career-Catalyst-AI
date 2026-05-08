'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized learning roadmap based on identified skill gaps for a target career role.
 *
 * - generateLearningRoadmap - A function that handles the generation of a learning roadmap.
 * - GenerateLearningRoadmapInput - The input type for the generateLearningRoadmap function.
 * - GenerateLearningRoadmapOutput - The return type for the generateLearningRoadmap function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLearningRoadmapInputSchema = z.object({
  targetRole: z.string().describe('The target career role for which to generate the roadmap.'),
  missingSkills: z.array(z.string()).describe('An array of skills the user needs to acquire.'),
  currentSkills: z.array(z.string()).optional().describe('An optional array of skills the user currently possesses.'),
});
export type GenerateLearningRoadmapInput = z.infer<typeof GenerateLearningRoadmapInputSchema>;

const LearningRoadmapLevelSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).describe('The proficiency level of the skills in this section.'),
  description: z.string().describe('A brief description of what should be learned at this level.'),
  skills: z.array(z.string()).describe('A list of skills or topics to learn at this level.'),
  resources: z.array(z.string()).optional().describe('Optional suggested resources (e.g., books, courses, tutorials).'),
});

const GenerateLearningRoadmapOutputSchema = z.object({
  roadmap: z.array(LearningRoadmapLevelSchema).describe('A personalized learning roadmap broken down by proficiency levels.'),
});
export type GenerateLearningRoadmapOutput = z.infer<typeof GenerateLearningRoadmapOutputSchema>;

export async function generateLearningRoadmap(input: GenerateLearningRoadmapInput): Promise<GenerateLearningRoadmapOutput> {
  return generateLearningRoadmapFlow(input);
}

const generateLearningRoadmapPrompt = ai.definePrompt({
  name: 'generateLearningRoadmapPrompt',
  input: { schema: GenerateLearningRoadmapInputSchema },
  output: { schema: GenerateLearningRoadmapOutputSchema },
  prompt: `You are an AI career coach specializing in creating personalized learning roadmaps.

Generate a detailed learning roadmap for a user who wants to become a {{{targetRole}}}.

The user currently has the following skills: {{{#if currentSkills}}}{{{currentSkills}}}{{#else}}None specified.{{/if}}.
They have identified the following key skills as missing or needing improvement for their target role: {{{missingSkills}}}.

Your roadmap should be structured into four distinct levels: 'Beginner', 'Intermediate', 'Advanced', and 'Expert'.
For each level, provide a brief description of the learning objectives, a list of specific skills or topics to master, and optionally, some suggested resources (e.g., book titles, course names, specific tools).

Focus on bridging the identified missing skills while building a comprehensive foundation for the {{{targetRole}}} role.
Ensure the roadmap logically progresses from fundamental concepts to more complex and specialized areas.
`,
});

const generateLearningRoadmapFlow = ai.defineFlow(
  {
    name: 'generateLearningRoadmapFlow',
    inputSchema: GenerateLearningRoadmapInputSchema,
    outputSchema: GenerateLearningRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await generateLearningRoadmapPrompt(input);
    return output!;
  }
);
