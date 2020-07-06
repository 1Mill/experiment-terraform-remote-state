FROM node:14-alpine

RUN apk update

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ENV NODE_ENV=production

COPY . .

CMD [ "npm", "run", "start" ]
