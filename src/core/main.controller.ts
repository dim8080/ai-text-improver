import { Job } from "bull";
import BaseController from "../core/base.controller";
import {Request, Response} from 'express';
import { TextQuery } from "../interfaces/common";
import { getCache, setCache } from "../config/redis";
import QueueService from "../services/QueueService";
import { redis } from "../config/redis";
import { anthropic } from "../config/anthropic";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { historyService } from "../services/HistoryService";
import { TextProcessingResult } from "../interfaces/text.processing";
const QueueServiceInstance = new QueueService('text-processing');

class MainController extends BaseController
{
     constructor() {
        super();
        // Setup queue processor
        QueueServiceInstance.processTextProcessing(async (job) => {
            return this.processJob(job);
        });
     }

    improveText = async (req: Request, res: Response) => {
        return this.handleRequest(async (data: any, params: any, query: TextQuery) => {
            try {
                const rawText: string = query.text;
                if (!rawText) {
                    return { error: 'Text is required', status: 400 };
                }

                const decodedText = decodeURIComponent(rawText);
                const sanitizedText = decodedText.trim()
                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

                const cacheKey = `text:${Buffer.from(rawText).toString('base64')}`;
                const cachedResult = await getCache(cacheKey);
                
                console.log(cachedResult, 'Cached Result');
                if (cachedResult) {
                    return { ...JSON.parse(cachedResult), status: 200 };
                }

                console.log(cacheKey, 'Cache Key');
                const job = await QueueServiceInstance.addToTextProcessing(
                    { text: rawText, cacheKey: cacheKey },
                    { 
                        removeOnComplete: 50,
                        removeOnFail: 50
                    }
                );
               
                await historyService.addEntry({
                    jobId: job.id.toString(),
                    text: rawText,
                    status: 'pending'
                });
               
                return { 
                    jobId: job.id,
                    status: 200,
                    message: 'Text processing started',
                    originalText: sanitizedText,
                };
            } catch (error) {
                console.error('Error processing text:', error);
                return { error: 'Invalid text format', status: 400 };
            }
        }, req, res);
    };

    getJobStatus = async (req: Request, res: Response) => {
        return this.handleRequest(async (data: any, params: any) => {
            try {
                const job = await QueueServiceInstance.getTextProcessingJob(params.jobId);
                
                if (!job) {
                    return { 
                        error: 'Not found',
                        message: 'Job not found',
                        status: 404 
                    };
                }
        
                const state = await job.getState();
                const result = job.returnvalue;
        
                return {
                    jobId: job.id,
                    state,
                    result: result || null,
                    status: 200
                };
            } catch (error) {
                console.error('Error checking job status:', error);
                return { 
                    error: 'Internal server error',
                    message: 'An unexpected error occurred',
                    status: 500 
                };
            }
        }, req, res);
    };

    private generateImprovedText(originalText: string): string {
        // Добавяме случайни подобрения
        const improvements = [
            ' (подобрено)',
            ' (оптимизирано)',
            ' (коригирано)',
            ' (редактирано)'
        ];
        return originalText + improvements[Math.floor(Math.random() * improvements.length)];
    }

    processJob = async (job: Job) => {
        try {
            await new Promise(resolve => setTimeout(resolve, Number(process.env.MOCK_PROCESSING_TIME)));
            const { text, cacheKey } = job.data;
            console.log('Processing job:', job.id, 'with text:', text);

            /**
             * Omitted as I do not have credits for the API
             */
           /* const messages = [
                {
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
                },
                {
                    role: 'user',
                    content: text
                }
            ];

            const response = await anthropic.messages.create({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1024,
                messages,
                temperature: 0
            });

            const result = JSON.parse(response.content[0].text);
            */

            /** Mocking the result */
            const improvedText = this.generateImprovedText(text);


            const result = {
                original: text,
                improved: improvedText,
                changes: [
                    {
                        type: 'style',
                        original: text,
                        improved: improvedText,
                        explanation: 'Текстът беше подобрен за по-добра яснота и стил.'
                    }
                ]
            };

            console.log('Caching result...');
            await redis.setex(cacheKey, 3600, JSON.stringify(result));
            await historyService.updateEntry(job.id.toString(), { 
                status: 'completed',
                result: result as TextProcessingResult
            });
            return result;
        } catch (error) {
            console.error('Error processing job:', error);
            throw error;
        }
    }

    getHistory = async (req: Request, res: Response) => {
        return this.handleRequest(async (data: any, params: any, query: any) => {
            try {
                const page = parseInt(query.page) || 1;
                const limit = parseInt(query.limit) || 10;
                
                const history = await historyService.getHistory(page, limit);
                
                return {
                    history,
                    page,
                    limit,
                    status: 200
                };
            } catch (error) {
                console.error('Error fetching history:', error);
                return { 
                    error: 'Failed to fetch history',
                    status: 500 
                };
            }
        }, req, res);
    };
}

export default MainController;