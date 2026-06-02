# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server code
COPY server .

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "run", "dev"]
