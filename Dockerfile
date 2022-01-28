FROM node:17.3-alpine
WORKDIR /graffiti-messages-api

COPY package.json /graffiti-messages-api/
RUN npm install --production

COPY . /graffiti-messages-api/
RUN npm run build

EXPOSE 5000

CMD [ "node", "dist/index.js" ]