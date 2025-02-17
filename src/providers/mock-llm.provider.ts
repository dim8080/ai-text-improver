import { BaseLLMProvider, LLMResponse } from '../core/base.llm.provider';

export class MockProvider extends BaseLLMProvider {
  async improveText(text: string): Promise<LLMResponse> {
    await new Promise(resolve => 
      setTimeout(resolve, Number(process.env.MOCK_PROCESSING_TIME))
    );

    const improvements = [
      ' (improved)',
      ' (optimized)',
      ' (corrected)',
      ' (edited)'
    ];

    const improvedText = text + improvements[Math.floor(Math.random() * improvements.length)];

    return {
      original: text,
      improved: improvedText,
      changes: [
        {
          type: 'style',
          original: text,
          improved: improvedText,
          explanation: 'Text was improved for better clarity and style.'
        }
      ]
    };
  }
}