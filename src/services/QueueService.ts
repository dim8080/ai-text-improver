import Queue from "bull";
import { JobOptions } from "bull";
import { JobData } from "../interfaces/bull";

/**
 * Queue service for text processing
 * Using Bull.js for this one, but we could use a different queue system like RabbitMQ or Kafka
 */
class QueueService {
  private textProcessingQueue: Queue.Queue;

  constructor(queueName: string) {
    console.log(`[QueueService] Initializing "${queueName}" queue for Redis URL: ${process.env.REDIS_URL}`);
    this.textProcessingQueue = new Queue(queueName, process.env.REDIS_URL);
    
    // Some event listeners
    this.textProcessingQueue.on('error', (error) => {
      console.error('Queue error:', error);
    });

    this.textProcessingQueue.on('active', (job) => {
      console.log('Job started:', job.id);
    });

    this.textProcessingQueue.on('completed', (job, result) => {
      console.log('Job completed:', job.id, result);
    });

    this.textProcessingQueue.on('failed', (job, error) => {
      console.error('Job failed:', job.id, error);
    });
  }

  /**
   * Add a job to the text processing queue
   * @param data 
   * @param options 
   * @returns 
   */
  async addToTextProcessing(data: JobData, options?: JobOptions) {
    console.log(`Adding job to queue: ${data.text.slice(0, 22)}...`);
    const job = await this.textProcessingQueue.add(data, options);
    console.log('Job added:', job.id);
    return job;
  }

  async getTextProcessingJob(jobId: string) {
    return await this.textProcessingQueue.getJob(jobId);
  }

  async processTextProcessing(processor: Queue.ProcessCallbackFunction<JobData>) {
    this.textProcessingQueue.process(processor);
  }

  async clearTextProcessingQueue() {
    await this.textProcessingQueue.empty();
  }

  getTextProcessingQueue() {
    return this.textProcessingQueue;
  }
}

export default QueueService; 