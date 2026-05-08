'use server';
/**
 * @fileOverview An AI agent that provides detailed feedback and actionable suggestions based on an ATS score, strengths, weaknesses, and initial suggestions.
 *
 * - atsScoreFeedbackAndSuggestions - A function that generates comprehensive feedback and improvement suggestions.
 * - AtsScoreFeedbackAndSuggestionsInput - The input type for the atsScoreFeedbackAndSuggestions function.
 * - AtsScoreFeedbackAndSuggestionsOutput - The return type for the atsScoreFeedbackAndSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AtsScoreFeedbackAndSuggestionsInputSchema = z.object({
  atsScore: z.number().describe('The calculated ATS score for the resume, out of 100.'),
  strengths: z.array(z.string()).describe('A list of identified strengths of the resume.'),
  weaknesses: z.array(z.string()).describe('A list of identified weaknesses of the resume.'),
  suggestions: z.array(z.string()).describe('A list of initial suggestions for improvement.'),
  targetRole: z.string().describe('The target career role the user is aiming for.'),
  currentResumeSummary: z
    .string()
    .describe('A brief summary or key extracted content from the user\u0027s current resume.'),
});
export type AtsScoreFeedbackAndSuggestionsInput = z.infer<
  typeof AtsScoreFeedbackAndSuggestionsInputSchema
>;

const AtsScoreFeedbackAndSuggestionsOutputSchema = z.object({
  overallFeedback: z
    .string()
    .describe('A comprehensive paragraph providing overall feedback on the resume, touching upon its current state and potential.'),
  actionableSuggestions: z
    .array(z.string())
    .describe('A list of specific, actionable steps the user can take to improve their resume\u0027s ATS compatibility and overall quality for the target role.'),
  strengthHighlights: z
    .array(z.string())
    .describe('A list of key strengths identified in the resume that align well with the target role.'),
});
export type AtsScoreFeedbackAndSuggestionsOutput = z.infer<
  typeof AtsScoreFeedbackAndSuggestionsOutputSchema
>;

export async function atsScoreFeedbackAndSuggestions(
  input: AtsScoreFeedbackAndSuggestionsInput
): Promise<AtsScoreFeedbackAndSuggestionsOutput> {
  return atsScoreFeedbackAndSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsScoreFeedbackAndSuggestionsPrompt',
  input: {schema: AtsScoreFeedbackAndSuggestionsInputSchema},
  output: {schema: AtsScoreFeedbackAndSuggestionsOutputSchema},
  prompt: `You are an expert career coach and resume analyst specializing in Applicant Tracking Systems (ATS). Your goal is to provide insightful and actionable feedback to a user based on their resume's ATS score, identified strengths, weaknesses, and initial suggestions. The user is targeting the role of '{{{targetRole}}}'.

Here is the information you have:
- ATS Score: {{{atsScore}}}/100
- Identified Strengths:
{{#each strengths}}- {{{this}}}
{{/each}}
- Identified Weaknesses:
{{#each weaknesses}}- {{{this}}}
{{/each}}
- Initial Suggestions:
{{#each suggestions}}- {{{this}}}
{{/each}}
- Current Resume Summary: {{{currentResumeSummary}}}

Based on this data and considering the target role of '{{{targetRole}}}', provide a comprehensive analysis. Your response should include:
1.  **Overall Feedback**: A concise paragraph summarizing the resume's current state regarding ATS compatibility and its potential for the '{{{targetRole}}}' role.
2.  **Actionable Suggestions**: A numbered list of specific, clear, and actionable steps the user can take to improve their resume. Focus on improving ATS keyword optimization, formatting, bullet point strength, and overall relevance to the '{{{targetRole}}}' role. Be detailed and practical.
3.  **Strength Highlights**: A numbered list of the top 3-5 strongest points from the 'Identified Strengths' that the user should emphasize or build upon for the '{{{targetRole}}}' role.

Ensure your tone is encouraging, professional, and directly addresses how to enhance ATS compatibility.`,
});

const atsScoreFeedbackAndSuggestionsFlow = ai.defineFlow(
  {
    name: 'atsScoreFeedbackAndSuggestionsFlow',
    inputSchema: AtsScoreFeedbackAndSuggestionsInputSchema,
    outputSchema: AtsScoreFeedbackAndSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
