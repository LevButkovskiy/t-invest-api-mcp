# Dockerfile for t-invest-api MCP server
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . ./

# Build TypeScript if needed (uncomment if build step required)
RUN npm run build

CMD ["node", "build/index.js"]
