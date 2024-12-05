# Build stage
FROM node:16-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM gcr.io/google.com/cloudsdktool/cloud-sdk:alpine

# Install nginx
RUN apk add --no-cache nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# Make script directory
RUN mkdir -p /docker-entrypoint.d

# Create start-nginx.sh
RUN echo $'#!/bin/sh\n\
sed -i "s/\$PORT/8080/g" /etc/nginx/http.d/default.conf\n\
nginx -g "daemon off;"' > /docker-entrypoint.d/start-nginx.sh

# Make script executable
RUN chmod +x /docker-entrypoint.d/start-nginx.sh

# Expose port
EXPOSE 8080

# Start nginx
ENTRYPOINT ["/docker-entrypoint.d/start-nginx.sh"]