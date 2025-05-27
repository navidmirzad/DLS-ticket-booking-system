# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

ARG VITE_BACKEND_API_URL
ARG VITE_AUTH_API_URL
ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_BACKEND_API_URL=${VITE_BACKEND_API_URL}
ENV VITE_AUTH_API_URL=${VITE_AUTH_API_URL}
ENV VITE_STRIPE_PUBLIC_KEY=${VITE_STRIPE_PUBLIC_KEY}

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

# Expose port 80
EXPOSE 80

# Start the application
CMD ["serve", "-s", "dist", "-l", "80"] 