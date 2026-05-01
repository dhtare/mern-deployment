# Stage 1: Build stage
FROM node:20-slim AS builder

# Install build tools ONLY in this temporary stage
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (including those needing compilation)
RUN npm install

# Stage 2: Run stage
FROM node:20-slim
WORKDIR /app

# We ONLY copy the node_modules and the code from the builder stage
# This throws away the g++, python, and build cache!
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 5000
CMD ["node", "index.js"]