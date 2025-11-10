FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY .env.production .env.production

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 8002

CMD ["serve", "-s", "dist", "-l", "8002"]