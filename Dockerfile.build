FROM node:18-alpine as builder

WORKDIR /app

# パッケージのインストール
COPY package*.json ./
RUN npm install

# ソースコードのコピーとビルド
COPY src/ ./src/
COPY public/ ./public/

# ビルドディレクトリの作成とファイルのコピー
RUN mkdir -p dist && \
    cp -r src/* dist/ && \
    cp -r public/* dist/

# ビルド成果物を含む軽量なイメージを作成
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
