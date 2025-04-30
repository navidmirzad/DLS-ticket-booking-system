# Build stage
FROM node:18-alpine AS builder

# Define build arguments
ARG VITE_LOGIN_URL
ARG VITE_ADMIN_BACKEND_URL
ARG VITE_VALIDATE_TOKEN_URL

# Set environment variables
ENV VITE_LOGIN_URL=$VITE_LOGIN_URL
ENV VITE_ADMIN_BACKEND_URL=$VITE_ADMIN_BACKEND_URL
ENV VITE_VALIDATE_TOKEN_URL=$VITE_VALIDATE_TOKEN_URL

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install serve package to serve static files
RUN npm install -g serve

# Expose port 81
EXPOSE 81

# Start the application
CMD ["serve", "-s", "dist", "-l", "81"] 