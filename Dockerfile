FROM node:17.3-alpine
WORKDIR /api-messages
ENV REST_PORT 5000

COPY package.json /api-messages/
RUN npm install --production

COPY . /api-messages/
RUN npm run build

RUN chmod +x start.sh
ENTRYPOINT ./start.sh