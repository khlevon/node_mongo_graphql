FROM node:16

RUN apt update -y
RUN apt install rsync -y

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
COPY package-lock.json .

RUN npm config set strict-ssl false
RUN npm install
RUN npm config set strict-ssl true

COPY . ./

