'use server';

import { generateMatchInsights, type GenerateMatchInsightsInput, type GenerateMatchInsightsOutput } from '@/ai/flows/generate-match-insights';
import { z } from 'zod';

const GenerateMatchInsightsInputSchema = z.object({
  team1Name: z.string(),
  team2Name: z.string(),
  matchDate: z.string(),
  leagueName: z.string(),
  pastResults: z.string(),
  team1Stats: z.string(),
  team2Stats: z.string(),
});

// A simple result type to handle success and error states
export type FormState = {
    success: boolean;
    message: string;
    data: GenerateMatchInsightsOutput | null;
}

export async function getMatchInsights(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    
  const validatedFields = GenerateMatchInsightsInputSchema.safeParse({
    team1Name: formData.get('team1Name'),
    team2Name: formData.get('team2Name'),
    matchDate: formData.get('matchDate'),
    leagueName: formData.get('leagueName'),
    pastResults: formData.get('pastResults'),
    team1Stats: formData.get('team1Stats'),
    team2Stats: formData.get('team2Stats'),
  });

  if (!validatedFields.success) {
    return {
        success: false,
        message: 'Invalid input data.',
        data: null
    };
  }
  
  try {
    const insights = await generateMatchInsights(validatedFields.data);
    return {
        success: true,
        message: 'Insights generated successfully.',
        data: insights
    };
  } catch (error) {
    console.error(error);
    return {
        success: false,
        message: 'Failed to generate insights. Please try again.',
        data: null,
    };
  }
}
