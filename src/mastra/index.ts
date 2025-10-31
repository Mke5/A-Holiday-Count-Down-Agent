
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
// import { weatherWorkflow } from './workflows/weather-workflow';
// import { weatherAgent } from './agents/weather-agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';
import { holidayWorkflow } from './workflows/holiday-workflow';
import { holidayAgent } from './agents/holiday-agent';

// export const mastra = new Mastra({
//   workflows: { weatherWorkflow },
//   agents: { weatherAgent },
//   scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
//   storage: new LibSQLStore({
//     // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
//     url: ":memory:",
//   }),
//   logger: new PinoLogger({
//     name: 'Mastra',
//     level: 'info',
//   }),
//   telemetry: {
//     // Telemetry is deprecated and will be removed in the Nov 4th release
//     enabled: false, 
//   },
//   observability: {
//     // Enables DefaultExporter and CloudExporter for AI tracing
//     default: { enabled: true }, 
//   },
// });

export const mastra = new Mastra({
  workflows: { holidayWorkflow },
  agents: { holidayAgent },
  scorers: { toolCallAppropriatenessScorer, completenessScorer },
  storage: new LibSQLStore({ url: ':memory:' }),
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
  observability: { default: { enabled: true } },
});

// const run = await holidayWorkflow.createRunAsync()
// async function runHolidayUpdate(){
//   try{
//     const country = process.env.COUNTRY_CODE || 'NG'
//     console.log(`🕒 Running scheduled holiday check for ${country}...`);
//     const result = await run.start({
//       inputData: { country }
//     })

//     const message = await result
//     if (!message) {
//       console.log('⚠️ No message generated');
//       return;
//     }
//     console.log(`✅ Holiday Update:\n${JSON.parse(JSON.stringify(message))}`);
//   }catch(error){
//     console.error('❌ Holiday update failed:', error);
//   }
// }

// runHolidayUpdate();
// setInterval(runHolidayUpdate, 24 * 60 * 60 * 1000);
// setInterval(runHolidayUpdate, 60 * 1000);