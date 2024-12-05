# Build stage
FROM node:16-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Set environment variable
ENV PORT=8080

# Use nginx template with environment variables
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"