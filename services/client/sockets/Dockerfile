FROM node:14-alpine

RUN apk update

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG PORT=8080
ENV \
	AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
	AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
	HOST=0.0.0.0 \
	NODE_ENV=production \
	PORT=${PORT} \
	RAPIDS_URLS=${RAPIDS_URLS}

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
