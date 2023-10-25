FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk add bash
RUN npm install

CMD ["npm", "run", "dev"]
