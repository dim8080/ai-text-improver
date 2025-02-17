import { BaseLLMProvider, LLMResponse, LLMConfig } from '../core/base.llm.provider';
import OpenAI from 'openai';
import { TEXT_IMPROVEMENT_OBJECT_OPENAI, TEXT_IMPROVEMENT_PROMPT_OPENAI } from './config/openai.config';
export class OpenAIProvider extends BaseLLMProvider {
  private openai: OpenAI;

  constructor(config: LLMConfig = {}) {
    super({
      model: 'gpt-4-turbo-preview',
      ...config
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async improveText(text: string): Promise<LLMResponse> {
    const response = await this.openai.chat.completions.create({
      model: this.config.model || 'gpt-4-0125-preview',
      messages: [
        TEXT_IMPROVEMENT_OBJECT_OPENAI,
        TEXT_IMPROVEMENT_PROMPT_OPENAI(text)
      ],
      temperature: this.config.temperature || 0,
      max_tokens: this.config.maxTokens || 1024,
      response_format: { type: "json_object" } // Ensure JSON response
    });

    return JSON.parse(response.choices[0].message.content || '');
  }
}