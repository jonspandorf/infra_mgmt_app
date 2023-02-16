FROM node:alpine AS build

ARG API_URL 
ENV REACT_APP_API_URL=$API_URL
COPY package.json package-lock.json ./
RUN npm install && mkdir /app && mv ./node_modules ./app
WORKDIR /app
COPY . .
RUN npm run build


# MAIN IMAGE
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]