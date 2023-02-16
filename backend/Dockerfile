FROM node:alpine

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN apk update && apk add --no-cache docker-cli mkpasswd
RUN npm i
CMD ["npm", "run", "start"]