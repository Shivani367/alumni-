# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install root dependencies
COPY package*.json ./
RUN npm install

# Copy backend package files and install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy all source files
COPY . .

# Build frontend static files
RUN npm run build

# Expose Hugging Face Space default port
EXPOSE 7860

# Set environment variables for production
ENV PORT=7860
ENV NODE_ENV=production

# Start backend server which serves both API and built React static files
CMD ["node", "server/server.js"]
