FROM --platform=linux/amd64 node:23-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package.json yarn.lock ./

USER node

RUN yarn install

COPY --chown=node:node . .

CMD [ "yarn", "start" ]
