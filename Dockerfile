FROM node:16.15.0 as base

WORKDIR /app

COPY src ./
COPY package.json ./

RUN npm install --silent
RUN npm run build

# Expose port 3000
EXPOSE 3000
CMD ["node", "./build/index.js"]