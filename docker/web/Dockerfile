FROM nginx:alpine

# Nginxの設定
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

# ヘルスチェック用ディレクトリの作成とファイルの配置
RUN mkdir -p /etc/nginx/healthcheck
RUN echo "health check ok" > /etc/nginx/healthcheck/health.html

# ドキュメントルートディレクトリの作成（ボリュームマウントポイント用）
RUN mkdir -p /usr/share/nginx/html

EXPOSE 80

# Nginxをフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"]