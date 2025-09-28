FROM node:18-alpine

WORKDIR /app

# ヘルスチェック用のwgetをインストール
RUN apk add --no-cache wget

COPY package*.json ./
COPY vite.config.js ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]