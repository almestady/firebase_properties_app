FROM node:8.17.0-jessie

RUN mkdir -p /home/node/properties-tag/node_modules && chown -R node:node /home/node/properties-tag

WORKDIR /home/node/properties-tag

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8100

CMD [ "ionic", "serve" ]