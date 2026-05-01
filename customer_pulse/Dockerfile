# Use a slim version of Node to save disk space
FROM node:20-slim

# Install system dependencies for 'canvas' (if you still use it)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# ONLY install production dependencies (saves ~50% space)
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]