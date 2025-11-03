
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { toolCallAppropriatenessScorer, completenessScorer } from './scorers/weather-scorer';
import { holidayWorkflow } from './workflows/holiday-workflow';
import { holidayAgent } from './agents/holiday-agent';
import { a2aAgentRoute } from './routes/a2a-agent-route';
import { weatherWorkflow } from './workflows/weather-workflow';

export const mastra = new Mastra({
  workflows: { holidayWorkflow},
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