# 予約メモ管理アプリ (Simple Notes App)

Next.js + Supabase + Tailwind CSS で作る講義用サンプルアプリです。
バージョンごとに実装やテストの進化を体験できます。

---

## セットアップ手順

1. 依存パッケージのインストール

   ```bash
   npm install
   ```

2. 環境変数ファイルの作成
   `.env.local.example` をコピーして `.env.local` を作成し、必要な値を設定

3. ローカル Supabase 環境の起動

   ```bash
   supabase start
   ```

4. 開発サーバーの起動

   ```bash
   npm run dev
   ```

5. 単体テストの実行

   ```bash
   npm run test:unit
   ```

6. E2E テストの実行
   ```bash
   npx playwright test
   ```

---

## その他

- 詳細な要件やバージョンごとの違いは、講義資料またはリポジトリのドキュメントを参照してください。
- 質問や不明点は講師まで。
