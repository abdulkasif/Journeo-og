#Use Node.js Base Image
FROM node:18

#Set the Working Directory
WORKDIR /usr/src/app

#Copying packages and install dependencies
COPY package*.json .
RUN npm install 

#Copy the application Code
COPY . .

#Expose the Default Port
EXPOSE 6000

#Run the Node Server
RUN ["node", "index.js"]