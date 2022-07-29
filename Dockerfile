FROM node:16-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
#RUN yarn build

#---
FROM node:16-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --production && yarn cache clean

#---
FROM node:16-alpine as production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node","dist/main.js"]

