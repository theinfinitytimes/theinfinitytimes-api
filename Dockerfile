FROM node:lts

RUN mkdir /theinfinitytimes-api
COPY ./package.json /theinfinitytimes-api
WORKDIR theinfinitytimes-api

RUN npm install

COPY . /theinfinitytimes-api

CMD npm start
