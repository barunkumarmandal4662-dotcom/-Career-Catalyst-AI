'use server';
/**
 * @fileOverview A Genkit flow for generating interview questions.
 *
 * - generateInterviewQuestions - A function that generates interview questions based on target role and difficulty.
 * - AiInterviewQuestionGenerationInput - The input type for the generateInterviewQuestions function.
 * - AiInterviewQuestionGenerationOutput - The return type for the generateInterviewQuestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiInterviewQuestionGenerationInputSchema = z.object({
  targetRole: z.string().describe('The target career role for which to generate interview questions.'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the interview questions.'),
});
export type AiInterviewQuestionGenerationInput = z.infer<typeof AiInterviewQuestionGenerationInputSchema>;

const AiInterviewQuestionGenerationOutputSchema = z.object({
  hrQuestions: z.array(z.string()).describe('A list of HR-related interview questions.'),
  technicalQuestions: z.array(z.string()).describe('A list of technical interview questions relevant to the target role.'),
  codingQuestions: z.array(z.string()).describe('A list of coding interview questions, potentially with small code snippets or problem descriptions.'),
  scenarioQuestions: z.array(z.string()).describe('A list of scenario-based interview questions to assess problem-solving and critical thinking.'),
});
export type AiInterviewQuestionGenerationOutput = z.infer<typeof AiInterviewQuestionGenerationOutputSchema>;

export async function generateInterviewQuestions(
  input: AiInterviewQuestionGenerationInput
): Promise<AiInterviewQuestionGenerationOutput> {
  return aiInterviewQuestionGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiInterviewQuestionGenerationPrompt',
  input: { schema: AiInterviewQuestionGenerationInputSchema },
  output: { schema: AiInterviewQuestionGenerationOutputSchema },
  prompt: `You are an expert career coach and interview preparation specialist.
Your task is to generate a comprehensive set of interview questions for a candidate targeting the "{{targetRole}}" role at a "{{difficulty}}" difficulty level.

The questions should be categorized into four types:
1.  HR Questions: Behavioral, cultural fit, and general interview questions.
2.  Technical Questions: Questions specific to the skills and knowledge required for the "{{targetRole}}" role.
3.  Coding Questions: Programming challenges or conceptual coding questions relevant to the role. For the "{{difficulty}}" level, ensure the coding questions are appropriate.
4.  Scenario-Based Questions: Questions that present hypothetical situations to assess problem-solving and critical thinking.

Provide 3-5 questions for each category. Ensure the questions are relevant to the specified role and difficulty.

Please generate the output in a JSON format matching the following schema:
{{{AiInterviewQuestionGenerationOutputSchema}}}
`,
});

const aiInterviewQuestionGenerationFlow = ai.defineFlow(
  {
    name: 'aiInterviewQuestionGenerationFlow',
    inputSchema: AiInterviewQuestionGenerationInputSchema,
    outputSchema: AiInterviewQuestionGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
