'use server';

/**
 * @fileOverview A Genkit flow for generating pre-match insights and predictions using an AI model.
 *
 * - generateMatchInsights - A function that handles the generation of pre-match insights.
 * - GenerateMatchInsightsInput - The input type for the generateMatchInsights function.
 * - GenerateMatchInsightsOutput - The return type for the generateMatchInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMatchInsightsInputSchema = z.object({
  team1Name: z.string().describe('The name of the first team.'),
  team2Name: z.string().describe('The name of the second team.'),
  matchDate: z.string().describe('The date of the match in ISO format (YYYY-MM-DD).'),
  leagueName: z.string().describe('The name of the league the match is in.'),
  pastResults: z.string().describe('The past results between the two teams.'),
  team1Stats: z.string().describe('Team statistics about team 1.'),
  team2Stats: z.string().describe('Team statistics about team 2.'),
});
export type GenerateMatchInsightsInput = z.infer<typeof GenerateMatchInsightsInputSchema>;

const GenerateMatchInsightsOutputSchema = z.object({
  prediction: z.string().describe('The predicted outcome of the match.'),
  confidence: z.number().describe('The confidence level of the prediction (0-100).'),
  suggestedBet: z.string().describe('A suggested bet with a short explanation.'),
  reasoning: z.string().describe('Reasoning behind the prediction'),
});
export type GenerateMatchInsightsOutput = z.infer<typeof GenerateMatchInsightsOutputSchema>;

export async function generateMatchInsights(input: GenerateMatchInsightsInput): Promise<GenerateMatchInsightsOutput> {
  return generateMatchInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMatchInsightsPrompt',
  input: {schema: GenerateMatchInsightsInputSchema},
  output: {schema: GenerateMatchInsightsOutputSchema},
  prompt: `You are an AI football analyst providing pre-match insights.

  Based on the following information, predict the outcome of the match, the confidence level (0-100), a suggested bet, and the reasoning behind the prediction.

  Team 1: {{{team1Name}}}
  Team 2: {{{team2Name}}}
  Match Date: {{{matchDate}}}
  League: {{{leagueName}}}
  Past Results: {{{pastResults}}}
  Team 1 Stats: {{{team1Stats}}}
  Team 2 Stats: {{{team2Stats}}}

  Format your response as:
  Prediction: [Predicted outcome]
  Confidence: [Confidence level (0-100)]
  Suggested Bet: [Suggested bet with explanation]
  Reasoning: [Reasoning behind the prediction] `,
});

const generateMatchInsightsFlow = ai.defineFlow(
  {
    name: 'generateMatchInsightsFlow',
    inputSchema: GenerateMatchInsightsInputSchema,
    outputSchema: GenerateMatchInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
