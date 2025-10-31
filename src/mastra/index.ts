
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import cron from "node-cron";
import { getUpcomingHoliday } from './tools/getUpcomingHoliday';
// import { weatherWorkflow } from './workflows/weather-workflow';
// import { weatherAgent } from './agents/weather-agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';
import { holidayWorkflow } from './workflows/holiday-workflow';
import { holidayAgent } from './agents/holiday-agent';
import { a2aAgentRoute } from './routes/a2a-agent-route';

export const mastra = new Mastra({
  workflows: { holidayWorkflow },
  agents: { holidayAgent },
  scorers: { toolCallAppropriatenessScorer, completenessScorer },
  storage: new LibSQLStore({ url: ':memory:' }),
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
  observability: { default: { enabled: true } },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true,
    },
    apiRoutes: [
      a2aAgentRoute
    ]
  }
});



// cron.schedule("* 9 * * *", async () => {
//   try{  
//     const holiday = await getUpcomingHoliday()
//     const message = `🌴 Next holiday: ${holiday.name} on ${holiday.date} (${holiday.daysLeft} days away).`;
//     console.log("⏰ Sending daily reminder:", message);
//   }catch(error){
//     console.error("Cron job error:", error);
//   }

//   0: Minute (0-59)
// 9: Hour (0-23)
// 15: Day of Month (1-31)
// *: Month (1-12 or JAN-DEC) - * means every month
// *: Day of Week (0-6 or SUN-SAT) - * means every day of the week
// })