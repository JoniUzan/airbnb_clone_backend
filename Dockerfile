# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Copy the rest of your application to the working directory
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Run npx to start the Express app (or any other npx command you need)
CMD ["npm", "run", "dev", "--", "--host" ]

