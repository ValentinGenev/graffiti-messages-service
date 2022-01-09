FROM node:17.3-alpine
WORKDIR /api-messages

COPY package.json /api-messages/
RUN npm install --production

COPY . /api-messages/
RUN npm run build

EXPOSE 5000

RUN chmod +x start.sh
ENTRYPOINT ./start.sh