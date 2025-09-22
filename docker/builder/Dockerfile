FROM node:18-alpine

WORKDIR /app

# パッケージのインストール
COPY package*.json ./
RUN npm install

# ソースコードのコピー
COPY src/ ./src/
COPY public/ ./public/

# ビルド実行（distディレクトリにファイルをコピー）
RUN npm run build

# ビルド成果物を/usr/share/nginx/htmlに直接コピー
RUN mkdir -p /usr/share/nginx/html
RUN cp -r dist/* /usr/share/nginx/html/