# Use long term support version of Node.js
FROM node:lts

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copying source
COPY . .

# Build production assets
RUN npm run build

# Run production server
CMD [ "npm", "start" ]
