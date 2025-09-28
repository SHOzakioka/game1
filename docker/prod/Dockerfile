# ビルドステージ
FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
COPY vite.config.js ./
RUN npm install

# ソースコードのコピーとビルド
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

# 本番ステージ
FROM nginx:alpine

# Nginxの設定
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

# ヘルスチェック用ディレクトリの作成とファイルの配置
RUN mkdir -p /etc/nginx/healthcheck
RUN echo "health check ok" > /etc/nginx/healthcheck/health.html

# ビルド成果物をNginxのドキュメントルートにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
