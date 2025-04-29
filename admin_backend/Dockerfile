FROM node:18-alpine

WORKDIR /app

# Install mysql client and curl (for wait-for-it)
RUN apk add --no-cache mysql-client curl

# Copy project files
COPY package*.json ./
RUN npm install
COPY . .

# Copy wait-for-it
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

EXPOSE 3001

# Wait for MySQL and then start app
CMD ["sh", "-c", "wait-for-it.sh mysql 3306 node app.js"]
