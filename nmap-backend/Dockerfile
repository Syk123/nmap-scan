FROM node:lts-alpine
WORKDIR /app

RUN apk add --no-cache nmap

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY ./src ./src
COPY server.ts server.ts

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]