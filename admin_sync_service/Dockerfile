# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install curl (for wait-for-it)
RUN apk add --no-cache curl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy wait-for-it
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expose the service port
EXPOSE 3004

# Start the service
CMD ["sh", "-c", "wait-for-it.sh rabbitmq:5672 -- wait-for-it.sh mysql:3306 -- node index.js"]

