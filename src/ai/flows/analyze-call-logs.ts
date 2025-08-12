
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing call logs and identifying trends in user behavior.
 *
 * - analyzeCallLogs - A function that analyzes call logs and returns insights.
 * - AnalyzeCallLogsInput - The input type for the analyzeCallLogs function.
 * - AnalyzeCallLogsOutput - The return type for the analyzeCallLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCallLogsInputSchema = z.object({
  callLogs: z.string().describe('A list of call logs in JSON format.'),
  historicalData:
    z.string()
      .optional()
      .describe('Historical data for the user, in JSON format.'),
});
export type AnalyzeCallLogsInput = z.infer<typeof AnalyzeCallLogsInputSchema>;

const AnalyzeCallLogsOutputSchema = z.object({
  insights: z.string().describe('Insights derived from the call logs and historical data.'),
  reminders:
    z.string()
      .optional()
      .describe('Tailored reminders based on the analysis.'),
  notifications:
    z.string()
      .optional()
      .describe('Tailored notifications based on the analysis.'),
});
export type AnalyzeCallLogsOutput = z.infer<typeof AnalyzeCallLogsOutputSchema>;

export async function analyzeCallLogs(input: AnalyzeCallLogsInput): Promise<AnalyzeCallLogsOutput> {
  return analyzeCallLogsFlow(input);
}

const analyzeCallLogsPrompt = ai.definePrompt({
  name: 'analyzeCallLogsPrompt',
  input: {schema: AnalyzeCallLogsInputSchema},
  output: {schema: AnalyzeCallLogsOutputSchema},
  prompt: `You are an AI assistant designed to analyze call logs and historical data to identify trends in user behavior and provide tailored recommendations.

  Analyze the following call logs:
  {{{callLogs}}}

  Here is some optional historical data about the user:
  {{{historicalData}}}

  Based on this information, generate actionable insights, tailored reminders, and high-priority notifications that will help the user optimize their operational flow. The output should be concise, clear, and directly applicable to the user's daily tasks.
  `,
});

const analyzeCallLogsFlow = ai.defineFlow(
  {
    name: 'analyzeCallLogsFlow',
    inputSchema: AnalyzeCallLogsInputSchema,
    outputSchema: AnalyzeCallLogsOutputSchema,
  },
  async input => {
    const {output} = await analyzeCallLogsPrompt(input);
    return output!;
  }
);

const CallSummaryInputSchema = z.object({
  audioRecordingUri: z.string().describe("A data URI of the audio recording. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

const CallSummaryOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the call conversation."),
  actionItems: z.array(z.string()).describe("A list of action items or next steps identified from the call."),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]).describe("The overall sentiment of the call."),
  fullTranscript: z.string().describe("The full transcription of the call."),
});

export type CallSummaryInput = z.infer<typeof CallSummaryInputSchema>;
export type CallSummaryOutput = z.infer<typeof CallSummaryOutputSchema>;


const summarizationPrompt = ai.definePrompt({
    name: 'summarizationPrompt',
    input: { schema: z.object({ transcript: z.string() }) },
    output: { schema: CallSummaryOutputSchema.omit({ fullTranscript: true }) },
    prompt: `You are an expert call analyst. Analyze the following call transcript and provide a concise summary, a list of action items, and the overall sentiment of the call.

    Transcript:
    {{{transcript}}}
    `,
});


const summarizeCallFlow = ai.defineFlow(
  {
    name: 'summarizeCallFlow',
    inputSchema: CallSummaryInputSchema,
    outputSchema: CallSummaryOutputSchema,
  },
  async (input) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("AI features are not configured on the server. Please add your Gemini API key.");
    }
    
    // 1. Transcribe the audio
    const { text: transcript } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: [{ media: { url: input.audioRecordingUri } }, { text: "Transcribe this audio recording." }],
    });

    if (!transcript) {
        throw new Error("Failed to transcribe the audio.");
    }

    // 2. Analyze the transcript for summary, action items, and sentiment
    const { output: analysis } = await summarizationPrompt({ transcript });

    if (!analysis) {
        throw new Error("Failed to analyze the transcript.");
    }

    return {
        ...analysis,
        fullTranscript: transcript,
    };
  }
);


export async function getCallSummaryAction(input: CallSummaryInput): Promise<CallSummaryOutput | { error: string }> {
  try {
    const output = await summarizeCallFlow(input);
    return output;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "An unknown error occurred while summarizing the call." };
  }
}
