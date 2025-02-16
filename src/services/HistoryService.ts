import { redis } from "../config/redis";
import { TextProcessingResult } from "../interfaces/text.processing";

interface HistoryEntry {
    jobId: string;
    text: string;
    timestamp: number;
    status: 'pending' | 'completed' | 'failed';
    result?: TextProcessingResult;
}

/**
 * History service for storing and retrieving text processing history
 * Again... using Redis for this, but we could use a database like PostgreSQL or MongoDB
 */
class HistoryService {
    private readonly HISTORY_KEY = 'text:history';
    private readonly MAX_HISTORY = 100; // Maximum number of records to store

    async addEntry(entry: Omit<HistoryEntry, 'timestamp'>) {
        const timestamp = Date.now();
        const historyEntry = { ...entry, timestamp };

        // Add to the beginning of the list
        await redis.lpush(this.HISTORY_KEY, JSON.stringify(historyEntry));
        
        // Keep the list at a maximum size
        await redis.ltrim(this.HISTORY_KEY, 0, this.MAX_HISTORY - 1);
        
        return historyEntry;
    }

    /**
     * Get history of text processing
     * @param page 
     * @param limit 
     * @returns 
     */
    async getHistory(page: number = 1, limit: number = 10): Promise<HistoryEntry[]> {
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        
        const entries = await redis.lrange(this.HISTORY_KEY, start, end);
        return entries.map(entry => JSON.parse(entry));
    }

    /**
     * Update an entry in the history
     * @param jobId 
     * @param updates 
     */
    async updateEntry(jobId: string, updates: Partial<HistoryEntry>) {
        const entries = await redis.lrange(this.HISTORY_KEY, 0, -1);
        
        for (let i = 0; i < entries.length; i++) {
            const entry = JSON.parse(entries[i]);
            if (entry.jobId === jobId) {
                const updatedEntry = { ...entry, ...updates };
                await redis.lset(this.HISTORY_KEY, i, JSON.stringify(updatedEntry));
                break;
            }
        }
    }
}

export const historyService = new HistoryService(); 