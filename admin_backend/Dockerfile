# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install MySQL client and other dependencies
RUN apk add --no-cache mysql-client

# Copy built files from builder stage
COPY --from=builder /app .

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "app.js"] 