# 講義用サンプルアプリ: Simple Notes App

## 概要

Next.js と Supabase を用いたメモ管理アプリケーションです。講義の進行に合わせて、伝統的な実装からモダンな実装へと段階的にリファクタリングを行うことで、実践的な開発プロセスを体験できます。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **データベース**: Supabase (PostgreSQL)
- **スタイリング**: Tailwind CSS
- **テスト**: Jest (単体テスト), Playwright (E2E テスト)

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`を`.env.local`にコピーして、適切な値を設定してください。

```bash
cp .env.local.example .env.local
```

### 3. Supabase ローカル環境の起動

```bash
npm run supabase:start
```

初回起動時に表示される URL、API KEY を`.env.local`に設定してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## テストの実行

### 全テストの実行

```bash
npm test
```

### 単体テストのみ

```bash
npm run test:unit
```

### E2E テストのみ

```bash
npm run test:e2e
```

## 開発バージョン管理

このプロジェクトは以下のバージョンタグで管理されています：

- `v1.0-initial`: 伝統的な実装（API Routes + useState）
- `v2.0-action-created`: Server Action の追加
- `v3.0-form-refactored`: フォームの Server Action 対応
- `v4.0-useformstatus-introduced`: useFormStatus の導入
- `v5.0-tests-updated`: テストの更新

各バージョンの詳細は `/doc/README.md` を参照してください。

## プロジェクト構造

```text
src/
├── app/
│   ├── api/notes/create/route.ts  # API Route (v1.0で使用)
│   ├── layout.tsx
│   └── page.tsx                   # メインページ
├── lib/
│   └── supabase/
│       ├── client.ts              # ブラウザ用Supabaseクライアント
│       └── server.ts              # サーバー用Supabaseクライアント
tests/
├── api/                           # 単体テスト
└── note.spec.ts                   # E2Eテスト
supabase/
└── migrations/                    # データベースマイグレーション
doc/                               # プロジェクトドキュメント
```

## 学習目標

1. **伝統的な React 開発**: useState による状態管理、fetch API の使用
2. **モダンな Next.js 開発**: Server Actions、useFormStatus の活用
3. **段階的リファクタリング**: 動作する状態を保ちながらの改善
4. **テスト駆動開発**: 単体テスト・E2E テストの実装と活用
5. **実用的な開発プロセス**: Git タグを活用したバージョン管理
