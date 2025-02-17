import { ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from "openai/resources/chat";

export const TEXT_IMPROVEMENT_OBJECT_OPENAI: ChatCompletionSystemMessageParam = {
    role: 'system',
    content: `You are a text improvement assistant. Analyze the following text for grammar,
     style, and clarity issues. Return a JSON response with the following structure:
     {
       "original": "original text",
       "improved": "improved text",
       "changes": [
         {
           "type": "grammar|style|clarity",
           "original": "original part",
           "improved": "improved part",
           "explanation": "why this change was made"
         }
       ]
     }`
}

export const TEXT_IMPROVEMENT_PROMPT_OPENAI = (text: string): ChatCompletionUserMessageParam => ({
    role: 'user',
    content: text,
})