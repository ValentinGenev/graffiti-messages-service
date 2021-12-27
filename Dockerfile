FROM node:17.3
WORKDIR /api-messages
ENV REST_PORT 5000

COPY package.json /api-messages/
RUN npm install --production
COPY . /api-messages/
RUN npm run build

CMD ["node", "dist/index.js"]