# Base image
FROM node

# Make folder to put our files in
WORKDIR /usr/src/app/backend

# Set working directory so that all subsequent command runs in this folder
WORKDIR /usr/src/app/backend

# Copy package json and install dependencies
COPY package*.json ./
RUN npm install

# Copy our app
COPY . .

# Expose port to access server
EXPOSE 8080

# Command to run our app
CMD [ "npm", "start"]

# Source: https://siddharth-lakhara.medium.com/dockerizing-a-full-stack-js-app-ceb99411996e