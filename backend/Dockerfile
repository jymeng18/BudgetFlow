FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm install -D typescript @types/node @types/express @types/cors @types/validator @types/uuid && \
    npm run build && \
    npm prune --production

EXPOSE 8000

ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/server.js"]
