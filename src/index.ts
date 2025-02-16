import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { checkRedisConnection } from "./config/redis";
import routes from './routes';
import { RateLimitConfig } from "./config/rateLimit";
import notFoundRoutes from "./routes/notFound.routes";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import QueueService from './services/QueueService';

// Load environment variables
dotenv.config({ path: ".env" });

async function main() {
  // Check Redis
  await checkRedisConnection();

  // Create Express app
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(rateLimit(RateLimitConfig));
  
  // Setup Bull Board
  const serverAdapter = new ExpressAdapter();
  const queueService = new QueueService('text-processing');

  // Select what we want to monitor
  createBullBoard({
    queues: [
      new BullAdapter(queueService.getTextProcessingQueue())
    ],
    serverAdapter
  });
  // Add Bull Board routes
  serverAdapter.setBasePath('/admin/queues');
  app.use('/admin/queues', serverAdapter.getRouter());
  // Main Routes
  app.use('/api/v1', routes);
  app.use('*', notFoundRoutes);

  const PORT = process.env.APP_PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();


