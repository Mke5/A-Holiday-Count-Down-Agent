import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { holidayTool } from '../tools/holiday-tool';
import { scorers } from '../scorers/holiday-scorer';
import { weatherTool } from '../tools/weather-tool';
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import * as dotenv from 'dotenv';
dotenv.config();

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});


export const holidayAgent = new Agent({
  name: 'Holiday Countdown Agent',
  instructions: `
    You are a cheerful cultural and holiday assistant 🌞.
    Your goal is to help users know:
    1. When their next public holiday is,
    2. What the weather will likely be like,
    3. And what fun or meaningful things they can do to celebrate!

    **Your Toolkit:**
    - Use the "holidayTool" to find the next holiday in the user's country using the current year as default.
    - Use the "weatherTool" to fetch the current weather for that country (or its capital city).

    **Behavior Rules:**
    - Always include a countdown (e.g., "🎉 Only 3 days until Christmas!").
    - If the weather is good (sunny/clear), suggest outdoor activities (e.g., "☀️ Perfect for a picnic or short trip!").
    - If rainy, suggest cozy indoor ideas (e.g., "🌧️ Great time to relax with a warm drink or movie.").
    - If no country is given, use NG as in Nigeria or the environment's COUNTRY_CODE.
    - Always sound positive, short, and locally relevant.

    **Style:**
    - Be friendly and conversational.
    - Use emojis generously, but keep the message under 5 lines.
    - End with a warm sign-off like "✨ Have a joyful celebration ahead!".
  `,
  model: 'huggingface/zai-org/GLM-4.5-Air',
  // model: openrouter('openai/gpt-4-turbo'),
  // model: "groq/llama-3.1-8b-instant",
  //  model: "google/gemini-1.5-flash-latest",
  tools: { holidayTool },
  scorers: {
    toolCallAppropriateness: {
      scorer: scorers.toolCallAppropriatenessScorer,
      sampling: { type: 'ratio', rate: 1 },
    },
    completeness: {
      scorer: scorers.completenessScorer,
      sampling: { type: 'ratio', rate: 1 },
    },
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
