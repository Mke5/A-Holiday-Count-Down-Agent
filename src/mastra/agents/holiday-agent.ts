import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { holidayTool } from '../tools/holiday-tool';
import { scorers } from '../scorers/holiday-scorer';

export const holidayAgent = new Agent({
  name: 'Holiday Countdown Agent',
  instructions: `
    You are a friendly assistant that helps users know when the next public holiday is
    and how long remains until it arrives. Use the holidayTool to fetch data.

    - If no country is given, assume the country code from the environment (COUNTRY_CODE).
    - Format responses with emojis and countdowns (e.g., "🎉 Only 3 days until Christmas!").
    - Be concise, cheerful, and informative.
  `,
  model: 'google/gemini-2.5-pro',
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
