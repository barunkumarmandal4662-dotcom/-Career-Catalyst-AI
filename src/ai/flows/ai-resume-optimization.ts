'use server';
/**
 * @fileOverview An AI agent for optimizing resumes based on a target role.
 *
 * - aiResumeOptimization - A function that handles the resume optimization process.
 * - AiResumeOptimizationInput - The input type for the aiResumeOptimization function.
 * - AiResumeOptimizationOutput - The return type for the aiResumeOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiResumeOptimizationInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The raw text content of the user\u0027s current resume.'),
  targetRole: z
    .string()
    .describe('The target career role for which the resume should be optimized.'),
  currentSkills: z
    .array(z.string())
    .describe('A list of skills extracted from the original resume.'),
  roleRequiredSkills: z
    .array(z.string())
    .describe('A list of skills identified as required for the target role.'),
  roleOptionalSkills: z
    .array(z.string())
    .describe('A list of skills identified as optional but beneficial for the target role.'),
  missingSkills: z
    .array(z.string())
    .describe(
      'A list of skills the user is currently missing for the target role. The AI should avoid fabricating these.'
    ),
});
export type AiResumeOptimizationInput = z.infer<
  typeof AiResumeOptimizationInputSchema
>;

const AiResumeOptimizationOutputSchema = z.object({
  optimizedResumeContent: z
    .string()
    .describe('The fully optimized resume content, ready for ATS parsing.'),
  professionalSummaryImprovements: z
    .string()
    .optional()
    .describe('A summary of how the professional summary was improved.'),
  projectsSectionImprovements: z
    .string()
    .optional()
    .describe('A summary of how the projects section was improved.'),
  bulletPointRewritesCount: z
    .number()
    .optional()
    .describe('The number of bullet points rewritten.'),
  atsKeywordsAddedCount: z
    .number()
    .optional()
    .describe('The number of ATS keywords strategically added.'),
});
export type AiResumeOptimizationOutput = z.infer<
  typeof AiResumeOptimizationOutputSchema
>;

export async function aiResumeOptimization(
  input: AiResumeOptimizationInput
): Promise<AiResumeOptimizationOutput> {
  return aiResumeOptimizationFlow(input);
}

const aiResumeOptimizerPrompt = ai.definePrompt({
  name: 'aiResumeOptimizerPrompt',
  input: {schema: AiResumeOptimizationInputSchema},
  output: {schema: AiResumeOptimizationOutputSchema},
  prompt: `You are an expert AI Resume Optimizer. Your goal is to take a user's resume, their target career role, and a list of identified skills (current, required, optional, missing) to generate a highly ATS-optimized version of their resume.

Focus on the following improvements:
1.  **Rewrite Weak Bullet Points**: Enhance and strengthen existing bullet points to be more impactful and results-oriented. Use strong action verbs.
2.  **Add ATS Keywords**: Incorporate relevant ATS (Applicant Tracking System) keywords based on the 'targetRole', 'roleRequiredSkills', and 'roleOptionalSkills'. Integrate these naturally into the resume content, especially in the skills section, experience, and projects.
3.  **Improve Formatting**: While you cannot directly apply rich formatting, structure the optimizedResumeContent for maximum readability and ATS parsing, using clear headings and bullet points where appropriate.
4.  **Add Industry-Standard Wording**: Replace generic phrasing with industry-specific terminology where appropriate for the 'targetRole'.
5.  **Enhance Action Verbs**: Ensure bullet points start with strong, dynamic action verbs.

**Special Focus Areas**:
*   **Professional Summary**: Generate a compelling and keyword-rich professional summary tailored to the 'targetRole'.
*   **Projects Section**: Optimize the projects section to highlight achievements, technologies used, and impact, aligning with the 'targetRole'.

**Constraints**:
*   Do NOT fabricate skills that are explicitly listed as 'missingSkills' unless you can credibly infer them from the 'currentSkills' or existing resume content.
*   The optimized resume should be a single text block.
*   Provide a count of bullet point rewrites and ATS keywords added if possible, or state if not applicable.

---

**Original Resume Content:**
{{{resumeContent}}}

---

**Target Career Role:**
{{{targetRole}}}

---

**Current Skills (extracted from original resume):**
{{#each currentSkills}}
- {{{this}}}
{{/each}}
{{#unless currentSkills}}
(No current skills provided)
{{/unless}}

---

**Skills Required for Target Role:**
{{#each roleRequiredSkills}}
- {{{this}}}
{{/each}}
{{#unless roleRequiredSkills}}
(No required skills provided)
{{/unless}}

---

**Skills Optional for Target Role:**
{{#each roleOptionalSkills}}
- {{{this}}}
{{/each}}
{{#unless roleOptionalSkills}}
(No optional skills provided)
{{/unless}}

---

**Skills Missing for Target Role (do not fabricate these):**
{{#each missingSkills}}
- {{{this}}}
{{/each}}
{{#unless missingSkills}}
(No missing skills provided)
{{/unless}}

---

Please provide the optimized resume content and a summary of the improvements made to the professional summary and projects section.
`,
});

const aiResumeOptimizationFlow = ai.defineFlow(
  {
    name: 'aiResumeOptimizationFlow',
    inputSchema: AiResumeOptimizationInputSchema,
    outputSchema: AiResumeOptimizationOutputSchema,
  },
  async (input) => {
    const {output} = await aiResumeOptimizerPrompt(input);
    return output!;
  }
);
