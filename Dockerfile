# Some basic dockerfile for development, could be improved
# Dockerfile
FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nodemon.json ./

# Install dependencies
RUN npm install -g nodemon
RUN npm install

# Copy source code
COPY . .

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_INTERVAL=1000

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "dev"]