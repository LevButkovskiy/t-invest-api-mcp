FROM node:20

WORKDIR /app

COPY package*.json ./
COPY . ./

RUN npm install
RUN npm run build

CMD ["node", "build/index.js"]