FROM node:17.3-alpine
WORKDIR /api-messages
ENV REST_PORT 5000

# dockerise will sync the entry point call with the database
ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY package.json /api-messages/
RUN npm install --production

COPY . /api-messages/
RUN npm run build

RUN chmod +x start.sh
ENTRYPOINT ./start.sh