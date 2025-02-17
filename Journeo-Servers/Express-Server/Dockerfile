#Use Node.js base image
FROM node:18

#Set the working directory
WORKDIR /usr/src/app

#Copying packages and install dependencies
COPY package*.json ./
RUN npm install

#Copy the application code
COPY . .

#Expose the Default port
EXPOSE 6001

#Run the Node Server
RUN ["node", "index.js"]