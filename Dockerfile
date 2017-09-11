FROM node:alpine

WORKDIR /opt/car2go/radar

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
