'use server';

import { locateParkingSpotFromImage, LocateParkingSpotFromImageInput, LocateParkingSpotFromImageOutput } from "@/ai/flows/locate-parking-spot";

export async function findMySpot(
  input: LocateParkingSpotFromImageInput
): Promise<{ data: LocateParkingSpotFromImageOutput | null; error: string | null }> {
  try {
    // The Genkit flow expects a specific data URI format.
    if (!input.photoDataUri.startsWith('data:image/')) {
        return { data: null, error: 'Invalid image format. Please upload a valid image file.' };
    }
    const result = await locateParkingSpotFromImage(input);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to locate spot. ${errorMessage}` };
  }
}
