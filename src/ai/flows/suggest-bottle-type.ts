
'use server';

/**
 * @fileOverview Implements an AI flow to suggest bottle types based on a photo.
 *
 * - suggestBottleType - The main function to call to get bottle type suggestions.
 * - SuggestBottleTypeInput - Input type for suggestBottleType, including a photo of the bottle.
 * - SuggestBottleTypeOutput - Output type, providing a list of suggested bottle types.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBottleTypeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plastic bottle, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestBottleTypeInput = z.infer<typeof SuggestBottleTypeInputSchema>;

const SuggestBottleTypeOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        type: z.string().describe('The brand and type of the bottle (e.g., Coca-Cola, Water Bottle).'),
      })
    )
    .optional()
    .describe("A list of suggested bottle types. This can be omitted if no bottle is found."),
  isBottle: z.boolean().describe("Set to true if the image contains a plastic bottle, otherwise false."),
});
export type SuggestBottleTypeOutput = z.infer<typeof SuggestBottleTypeOutputSchema>;

export async function suggestBottleType(input: SuggestBottleTypeInput): Promise<SuggestBottleTypeOutput> {
  return suggestBottleTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBottleTypePrompt',
  input: {schema: SuggestBottleTypeInputSchema},
  output: {schema: SuggestBottleTypeOutputSchema},
  prompt: `Analyze the image provided. Your task is to identify if it contains a plastic bottle. You must reject all other types of bottles, such as glass or steel.

- If the image contains a plastic bottle with a recognizable brand (e.g., Coca-Cola, Pepsi, Aquafina), identify the brand name. For the 'type' field, use the brand name. Set 'isBottle' to true.
- If the image contains a generic plastic bottle where the brand is not clear, set the 'type' field to "Water Bottle". Set 'isBottle' to true.
- If the image contains a glass bottle, a steel bottle, or any other non-plastic item, you must set the 'isBottle' field to false. Do not provide the 'suggestions' array.
- If the image does not contain any kind of bottle, set the 'isBottle' field to false and do not provide the 'suggestions' array.

Your response must be in the specified JSON format.

Photo: {{media url=photoDataUri}}
`,
});

const suggestBottleTypeFlow = ai.defineFlow(
  {
    name: 'suggestBottleTypeFlow',
    inputSchema: SuggestBottleTypeInputSchema,
    outputSchema: SuggestBottleTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
