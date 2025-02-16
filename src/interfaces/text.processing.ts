
export interface TextProcessingResult {
    original: string;
    improved: string;
    changes: Array<{
        type: 'style' | 'grammar' | 'clarity';
        original: string;
        improved: string;
        explanation: string;
    }>;
}