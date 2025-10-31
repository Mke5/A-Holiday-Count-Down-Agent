import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

interface Holiday {
  name: string;
  date: string;
}

export const holidayTool = createTool({
  id: 'get-holidays',
  description: 'Fetches upcoming holidays for a given country using Calendarific API.',
  inputSchema: z.object({
    country: z.string().describe('The 2-letter country code (e.g., US, GB, NG)'),
  }),
  outputSchema: z.object({
    holidays: z.array(z.object({
      name: z.string(),
      date: z.string(),
    })),
  }),
  execute: async ({ context }) => {
    const country = context.country;
    const apiKey = process.env.CALENDARIFIC_API_KEY;
    const year = new Date().getFullYear();

    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data?.response?.holidays) {
      throw new Error('Failed to fetch holidays');
    }

    const today = new Date();
    const holidays: Holiday[] = Object.values(data.response.holidays)
      .flat()
      .map((h: any) => ({
        name: h.name,
        date: h.date.iso,
      }))
      .filter((h: Holiday) => new Date(h.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { holidays };
  },
});
