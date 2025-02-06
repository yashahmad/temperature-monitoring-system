FROM node:18-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy application source
COPY . .

# Expose and run
EXPOSE 5000
CMD ["npm", "start"]