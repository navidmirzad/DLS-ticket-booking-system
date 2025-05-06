FROM node:18-alpine

WORKDIR /app

# Install curl (for wait-for-it)
RUN apk add --no-cache curl

# Copy project files
COPY package*.json ./
RUN npm install
COPY . .

# Copy wait-for-it
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

EXPOSE 3005

# Wait for RabbitMQ and then start app
CMD ["sh", "-c", "wait-for-it.sh rabbitmq 5672 node index.js"]