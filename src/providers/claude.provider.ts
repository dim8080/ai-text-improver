import { BaseLLMProvider, LLMConfig, LLMResponse } from "../core/base.llm.provider";
import { anthropic } from "../config/anthropic";
import { TEXT_IMPROVEMENT_OBJECT, TEXT_IMPROVEMENT_PROMPT } from "./config/claude.config";
import { MessageParam } from "@anthropic-ai/sdk/resources";


export class ClaudeProvider extends BaseLLMProvider {
    constructor(config: LLMConfig = {}) {
        super({
            model: "claude-3-5-sonnet-20240620",
            ...config,
        });
    }

    async improveText(text: string): Promise<LLMResponse> {
        const messages = [
            TEXT_IMPROVEMENT_OBJECT,
            TEXT_IMPROVEMENT_PROMPT(text),
        ];

        const response = await anthropic.messages.create({
            model: this.config.model || 'claude-3-sonnet-20240229',
            max_tokens: this.config.maxTokens,
            messages: messages as MessageParam[],
            temperature: this.config.temperature
        });

        const content = response.content[0].text;
        const jsonResponse = JSON.parse(content);

        return jsonResponse;
    }
}