FROM node:18.17.1

WORKDIR /app

COPY package.json package-lock.json .
RUN npm i

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "./dist/main.js"]