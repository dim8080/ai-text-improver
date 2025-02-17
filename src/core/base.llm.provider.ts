export interface LLMResponse {
    original: string;
    improved: string;
    changes: Array<{
      type: 'grammar' | 'style' | 'clarity';
      original: string;
      improved: string;
      explanation: string;
    }>;
} 
export interface LLMConfig {
temperature?: number;
maxTokens?: number;
model?: string;
}

export abstract class BaseLLMProvider {
    protected config: LLMConfig;
    
    constructor(config: LLMConfig) {
        this.config = {
            temperature: 0.5,
            maxTokens: 1024,
            ...config,
        }
    }

    abstract improveText(text: string): Promise<LLMResponse>;

}