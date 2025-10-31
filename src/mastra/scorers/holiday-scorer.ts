import { createCompletenessScorer } from '@mastra/evals/scorers/code';
import { createToolCallAccuracyScorerCode } from '@mastra/evals/scorers/code';

export const toolCallAppropriatenessScorer = createToolCallAccuracyScorerCode({
  expectedTool: 'holidayTool',
  strictMode: false,
});

export const completenessScorer = createCompletenessScorer();

export const scorers = {
  toolCallAppropriatenessScorer,
  completenessScorer,
};
