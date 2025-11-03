import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

interface Holiday {
  name: string;
  date: string;
}

export const holidayTool = createTool({
  id: 'get_holidays',
  description: 'Fetches public holidays for a specific country and year from Calendarific API. Use this when users ask about holidays, public holidays, national holidays, or holiday dates.',
  inputSchema: z.object({
    country: z.string().describe('The 2-letter country code (e.g., US, GB, NG)'),
    year: z.number().int().min(2000).max(2030).describe('Defaullt Current Year to fetch holidays for'),
    month: z.number().int().min(1).max(12).optional().describe('Optional: specific month (1-12)'),
    day: z.number().int().min(1).max(31).optional().describe('Optional: specific day'),
  }),
  outputSchema: z.object({
    holidays: z.array(z.object({
      name: z.string(),
      date: z.string(),
    })),
    today: z.string(),
  }),
  execute: async ({ context }) => {
    try{

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
      // const holidays: Holiday[] = Object.values(data.response.holidays)
      //   .flat()
      //   .map((h: any) => ({
      //     name: h.name,
      //     date: h.date.iso,
      //   }))
      //   .filter((h: Holiday) => new Date(h.date) > today)
      //   .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const holidays = data.response.holidays.map((holiday: any) => ({
        name: holiday.name,
        description: holiday.description,
        date: holiday.date.iso,
        type: holiday.type,
        locations: holiday.locations,
        states: holiday.states,
      }));
      return { holidays: holidays, today: new Date().toISOString() };
    }catch(error){
      console.error('Error fetching holidays:', error);
      throw error;
    }
  },
});
