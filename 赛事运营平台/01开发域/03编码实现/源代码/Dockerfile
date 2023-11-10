# Use node 8.16.0 LTS
# node原版本 10.23.0
FROM node:14.16.0 as build-stage
MAINTAINER full stack <fullstack1120@gmail.com>
ARG NODE_ENV
WORKDIR /app
COPY package*.json ./
# RUN npm install
RUN npm install --registry https://registry.npmmirror.com/
COPY . .
RUN npm run build:$NODE_ENV

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
