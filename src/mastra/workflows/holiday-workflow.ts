import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const getNextHoliday = createStep({
    id: 'fetch-next-holiday',
    description: 'Fetch the next public holiday for a given country.',
    inputSchema: z.object({
        country: z.string().default(process.env.COUNTRY_CODE || 'US'),
    }),
    outputSchema: z.object({
        name: z.string(),
        date: z.string(),
        countdown: z.string(),
    }),
    execute: async ({ inputData }) => {
        const apiKey = process.env.CALENDARIFIC_API_KEY;
        const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${inputData.country}&year=${new Date().getFullYear()}`;

        const res = await fetch(url);
        const data = await res.json();

        const holidays = Object.values(data.response.holidays).flat();
        const today = new Date();
        const upcoming = holidays
        .map((h: any) => ({
            name: h.name,
            date: new Date(h.date.iso),
        }))
        .filter((h) => h.date > today)
        .sort((a: any, b: any) => a.date - b.date);

        if (!upcoming.length) throw new Error('No upcoming holidays');

        const next = upcoming[0];
        const diff = next.date.getTime() - today.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const countdown = `${days} days remaining`;

        return { name: next.name, date: next.date.toISOString(), countdown };
    },
});

const generateMessage = createStep({
  id: 'generate-message',
  description: 'Create a cheerful, informative holiday message with explanation using Gemini.',
  inputSchema: z.object({
    name: z.string(),
    date: z.string(),
    countdown: z.string(),
    country: z.string(),
  }),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('holidayAgent');
    if (!agent) throw new Error('Holiday agent not found');

    const prompt = `
      You are a friendly holiday assistant. The next holiday information is:
        - Name: ${inputData.name}
        - Date: ${new Date(inputData.date).toDateString()}
        - Countdown: ${inputData.countdown}
        - Country: ${inputData.country}

        Generate a short message in this exact structure:

        🎉 [Cheerful one-line holiday announcement]

        📖 *Explanation:* [1–2 sentences about the holiday’s history, meaning, or how it's celebrated in ${inputData.country}. etc.]

        🗓️ *Countdown:* ${inputData.countdown}

        Rules:
        - Always include the *Explanation* section.
        - Keep total output under 4 lines.
        - Tone should be warm, informative, and localized to ${inputData.country}.
    `;

    const response = await agent.stream([{ role: 'user', content: prompt }]);

    let message = '';
    for await (const chunk of response.textStream) {
        // console.log("from work flow", chunk)
        
        message += chunk;
    }
    console.log(message)
    return { message };
  },
});



export const holidayWorkflow = createWorkflow({
    id: 'holiday-workflow',
    inputSchema: z.object({
        country: z.string().default(process.env.COUNTRY_CODE || 'NG'),
    }),
    outputSchema: z.object({
        message: z.string(),
    }),
})
.then(getNextHoliday)
.then(generateMessage)

holidayWorkflow.commit();
