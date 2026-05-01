FROM node:20-slim
WORKDIR /app

# We REMOVED the apt-get install line entirely. 
# This saves nearly 600MB of temporary disk space.

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5000
CMD ["node", "index.js"]