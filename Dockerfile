FROM node:16.15-alpine as base

WORKDIR /game-api

COPY src .
COPY package.json ./
COPY tsconfig.json ./

#COPY node_modules ./
RUN npm install --silent
RUN ./node_modules/typescript/bin/tsc


# Expose port 5000
#EXPOSE 5000
CMD ["node", "./build/index.js"]