'use server';
/**
 * @fileOverview An AI flow to analyze notification content for safety.
 *
 * - analyzeNotification - A function that handles the notification analysis.
 * - AnalyzeNotificationInput - The input type for the analyzeNotification function.
 * - AnalyzeNotificationOutput - The return type for the analyzeNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNotificationInputSchema = z.object({
  title: z.string().describe('The title of the notification.'),
  message: z.string().describe('The message content of the notification.'),
});
export type AnalyzeNotificationInput = z.infer<typeof AnalyzeNotificationInputSchema>;

const AnalyzeNotificationOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the content is safe and appropriate for all audiences.'),
  reason: z.string().describe('A brief explanation for the safety assessment.'),
});
export type AnalyzeNotificationOutput = z.infer<typeof AnalyzeNotificationOutputSchema>;

export async function analyzeNotification(input: AnalyzeNotificationInput): Promise<AnalyzeNotificationOutput> {
  return analyzeNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNotificationPrompt',
  input: {schema: AnalyzeNotificationInputSchema},
  output: {schema: AnalyzeNotificationOutputSchema},
  prompt: `You are a content safety moderator for an educational platform for students and instructors. Your task is to analyze the following notification content to ensure it is professional, safe, and free of any inappropriate, sensitive, or harmful material.

Analyze the title and message below.

Title: {{{title}}}
Message: {{{message}}}

Determine if the content is safe. If it is safe, provide a brief, positive confirmation. If it is not safe, explain clearly and concisely why it is not appropriate.
`,
});

const analyzeNotificationFlow = ai.defineFlow(
  {
    name: 'analyzeNotificationFlow',
    inputSchema: AnalyzeNotificationInputSchema,
    outputSchema: AnalyzeNotificationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
