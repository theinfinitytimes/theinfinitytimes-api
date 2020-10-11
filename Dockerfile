FROM node:lts

RUN mkdir /theinfinitytimes-api
COPY ./package.json /theinfinitytimes-api
WORKDIR /theinfinitytimes-api

RUN npm install

COPY . /theinfinitytimes-api
RUN mv .env.example .env

CMD npm run start:prod
