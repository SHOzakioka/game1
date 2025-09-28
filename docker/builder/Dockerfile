FROM node:18-alpine

WORKDIR /app

# パッケージのインストール
COPY package*.json ./
RUN npm install

# ソースコードのコピー
COPY src/ ./src/
COPY public/ ./public/

# distディレクトリを作成し、ファイルをコピー
RUN mkdir -p dist && \
    cp -r src/* dist/ && \
    cp -r public/* dist/

# 共有ボリュームにコピー
VOLUME /dist
CMD ["cp", "-r", "dist/.", "/dist/"]