FROM node:14-buster

# Install SOPS package from source
RUN apt-get update && apt-get install --yes wget
ENV SOPS_VERSION=3.5.0
RUN wget -O /tmp/sops.deb https://github.com/mozilla/sops/releases/download/v${SOPS_VERSION}/sops_${SOPS_VERSION}_amd64.deb
RUN apt install /tmp/sops.deb
RUN rm -rf /tmp/sops.deb
RUN apt-get remove --purge --yes wget

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
	PORT=${PORT}

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
