FROM node:14-alpine

RUN apk update

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG PORT=8080
ENV \
	HOST=0.0.0.0 \
	NODE_ENV=production \
	PORT=${PORT} \
	VUE_APP_SOCKETS_URL=${VUE_APP_SOCKETS_URL}

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
