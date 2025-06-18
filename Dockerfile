# Use Node.js LTS base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build Next.js app
RUN npm run build

# -------------------
# Production container
# -------------------
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set environment
ENV NODE_ENV=production
EXPOSE 8080

# Run Next.js in standalone mode (if using App Router)
CMD ["node_modules/next/dist/bin/next", "start", "-p", "8080"]
