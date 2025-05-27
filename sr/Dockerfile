# Use a Node.js base image with Chromium dependencies
FROM node:20-slim

# Install dependencies required for Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY src/package.json .
RUN npm install

# Copy the rest of the application
COPY src/ .

# Expose the port
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
