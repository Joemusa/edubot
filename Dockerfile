# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from cloud folder
COPY cloud/package*.json ./

# Install dependencies
RUN npm install

# Copy all app files from cloud folder
COPY cloud/ ./

# Expose port 3000 (or your app’s port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

