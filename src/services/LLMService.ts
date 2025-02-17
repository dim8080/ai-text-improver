import { BaseLLMProvider, LLMConfig, LLMResponse } from '../core/base.llm.provider';
import { ClaudeProvider } from '../providers/claude.provider';
import { OpenAIProvider } from '../providers/open-ai.provider';
import { MockProvider } from '../providers/mock-llm.provider';

export type LLMProvider = 'claude' | 'openai' | 'mock';

export class LLMService {
  private provider: BaseLLMProvider;

  constructor(provider: LLMProvider = 'mock', config: LLMConfig = {}) {
    this.provider = this.createProvider(provider, config);
  }

    private createProvider(provider: LLMProvider, config: LLMConfig): BaseLLMProvider {
        switch (provider) {
            case 'claude':
                return new ClaudeProvider(config);
            case 'openai':
                return new OpenAIProvider(config);
            case 'mock':
            default:
                return new MockProvider(config);
        }
    }

  async improveText(text: string): Promise<LLMResponse> {
    return this.provider.improveText(text);
  }
}