'use server';

/**
 * @fileOverview Implements an AI flow to suggest bottle types based on a photo.
 *
 * - suggestBottleType - The main function to call to get bottle type suggestions.
 * - SuggestBottleTypeInput - Input type for suggestBottleType, including a photo of the bottle and validation step.
 * - SuggestBottleTypeOutput - Output type, providing a list of suggested bottle types and validation flags.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBottleTypeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plastic bottle, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  validationStep: z.enum(['identify', 'confirm']).describe("The validation step to perform: 'identify' the bottle or 'confirm' the deposit."),
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
  isPlasticBottle: z.boolean().describe("Set to true if the image contains a plastic bottle, otherwise false."),
  isDeposited: z.boolean().describe("Set to true if the image shows a bottle being placed inside a recycling bin."),
});
export type SuggestBottleTypeOutput = z.infer<typeof SuggestBottleTypeOutputSchema>;

export async function suggestBottleType(input: SuggestBottleTypeInput): Promise<SuggestBottleTypeOutput> {
  return suggestBottleTypeFlow(input);
}


// A dedicated prompt for the 'identify' step
const identifyBottlePrompt = ai.definePrompt({
    name: 'identifyBottlePrompt',
    input: { schema: z.object({ photoDataUri: z.string() }) },
    output: { schema: SuggestBottleTypeOutputSchema },
    prompt: `You are an AI assistant for a recycling app. Your ONLY task is to identify if the primary object in the image is a plastic bottle.

- If it is a plastic bottle with a visible brand (e.g., "Coca-Cola", "Pepsi"), identify the brand for the 'type' field and set 'isPlasticBottle' to true.
- If it is a generic plastic bottle (like a water bottle), set the 'type' field to "Water Bottle" and set 'isPlasticBottle' to true.
- If the object is NOT a plastic bottle (e.g., glass, can, or anything else), you MUST set 'isPlasticBottle' to false. Do not provide suggestions.
- In this step, you MUST IGNORE whether it is in a bin or not. You MUST set 'isDeposited' to false.

Your response must be in the specified JSON format.

Photo: {{media url=photoDataUri}}
`,
});

// A dedicated prompt for the 'confirm' step
const confirmDepositPrompt = ai.definePrompt({
    name: 'confirmDepositPrompt',
    input: { schema: z.object({ photoDataUri: z.string() }) },
    output: { schema: SuggestBottleTypeOutputSchema },
    prompt: `You are an AI assistant for a recycling app. Your ONLY task is to verify if the image shows a hand placing a bottle into a recycling bin or a similar waste container.

- The action of putting the bottle into the bin must be clear.
- If this action is visible, you MUST set 'isDeposited' to true.
- If the action is NOT visible (e.g., bottle is just held, on a table, or not present), you MUST set 'isDeposited' to false.
- In this step, you MUST IGNORE the type of bottle. You MUST set 'isPlasticBottle' to false and do not return any suggestions.

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
  async (input) => {
    if (input.validationStep === 'identify') {
      const { output } = await identifyBottlePrompt({ photoDataUri: input.photoDataUri });
      return output!;
    } else { // 'confirm'
      const { output } = await confirmDepositPrompt({ photoDataUri: input.photoDataUri });
      return output!;
    }
  }
);
