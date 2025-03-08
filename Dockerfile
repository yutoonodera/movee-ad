# ベースイメージ
FROM node:18-alpine

# 作業ディレクトリの設定
WORKDIR /app

# パッケージ情報をコピーし、依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# アプリのソースコードをコピー
COPY . .

# Next.jsのビルド
RUN npm run build

# ポートを指定
EXPOSE 3000

# 修正: コンテナ起動時にビルドを確認し、必要なら実行
CMD [ "sh", "-c", "test -d .next || npm run build && npm run start" ]
