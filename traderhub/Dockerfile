FROM node:16.3

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

EXPOSE 3000
COPY traderhub .
RUN npm install --silent

CMD ["npm", "start"]