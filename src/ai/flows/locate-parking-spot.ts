'use server';

/**
 * @fileOverview A parking spot locator AI agent.
 *
 * - locateParkingSpotFromImage - A function that handles the parking spot location process.
 * - LocateParkingSpotFromImageInput - The input type for the locateParkingSpotFromImage function.
 * - LocateParkingSpotFromImageOutput - The return type for the locateParkingSpotFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocateParkingSpotFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a parking spot, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type LocateParkingSpotFromImageInput = z.infer<typeof LocateParkingSpotFromImageInputSchema>;

const LocateParkingSpotFromImageOutputSchema = z.object({
  locationDescription: z
    .string()
    .describe('The description of the parking spot location within the parking lot.'),
});
export type LocateParkingSpotFromImageOutput = z.infer<typeof LocateParkingSpotFromImageOutputSchema>;

export async function locateParkingSpotFromImage(
  input: LocateParkingSpotFromImageInput
): Promise<LocateParkingSpotFromImageOutput> {
  return locateParkingSpotFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'locateParkingSpotFromImagePrompt',
  input: {schema: LocateParkingSpotFromImageInputSchema},
  output: {schema: LocateParkingSpotFromImageOutputSchema},
  prompt: `You are an AI assistant designed to help users locate their parking spot within a parking lot based on an image they provide.

  Analyze the image and provide a description of the parking spot's location within the parking lot. Be as specific as possible, noting any landmarks, nearby signs, or other distinguishing features.

  Image: {{media url=photoDataUri}}`,
});

const locateParkingSpotFromImageFlow = ai.defineFlow(
  {
    name: 'locateParkingSpotFromImageFlow',
    inputSchema: LocateParkingSpotFromImageInputSchema,
    outputSchema: LocateParkingSpotFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
