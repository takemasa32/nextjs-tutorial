# TODO リスト

## 環境構築

- [x] Next.js プロジェクト作成 (TypeScript, Tailwind CSS, App Router)
- [x] 依存ライブラリのインストール (Supabase, Jest, Playwright)
- [x] 古い依存関係の修正 (@supabase/auth-helpers-nextjs → @supabase/ssr)
- [x] Jest の設定 (`jest.config.ts`, `jest.setup.ts`)
- [x] Playwright の設定 (`playwright.config.ts`)
- [x] `package.json`にテストスクリプトを追加
- [x] `/doc` ディレクトリとドキュメントの作成
- [x] `README.md` の作成 (ルート)
- [x] `.env.local.example` の作成
- [x] Supabase のローカル環境設定 (`supabase init`)
- [x] `notes`テーブルのマイグレーションファイル作成

## v1.0-initial: 伝統的な実装（個別型定義 + API Routes）

- [x] 型定義ファイル (`/src/types/note.ts`) を個別に作成
- [x] API Routes (`/api/notes/create/route.ts`) を使用してメモ新規作成機能を実装
- [x] メインページで fetch を使用した従来型のデータ取得・送信を実装
- [x] データ取得・更新時のローディング状態を `useState` で管理
- [x] 詳細なエラーハンドリングを実装
- [x] 上記機能に対する単体テスト (Jest) を実装
- [x] 上記機能に対する E2E テスト (Playwright) を実装
- [ ] 全てのテストがパスすることを確認
- [ ] `v1.0-initial` タグを作成

## v2.0-action-created: Server Action の作成（Supabase 型導入）

- [ ] Supabase から型を生成・エクスポート
- [ ] 型ヘルパーユーティリティの作成 (`/src/lib/types.ts`)
- [ ] `app/notes/_actions.ts` を作成
- [ ] `createNote` Server Action を実装 (DB 保存, `revalidatePath`, `redirect`)
- [ ] v1.0 と UI は同じ、内部実装のみ準備
- [ ] `v2.0-action-created` タグを作成

## v3.0-form-refactored: フォームの接続先変更

- [ ] フォームコンポーネントの分離 (`components/NoteForm.tsx`)
- [ ] `fetch` 処理を削除、`<form>` の `action` に Server Action を接続
- [ ] メインページからフォームロジックを分離
- [ ] `v3.0-form-refactored` タグを作成

## v4.0-useformstatus-introduced: モダンなローディング管理

- [ ] `SubmitButton.tsx` を作成し `useFormStatus` を使用
- [ ] `NoteForm.tsx` の `useState` ローディング管理を `<SubmitButton />` に置き換え
- [ ] 型安全なフォーム状態管理の実装
- [ ] `v4.0-useformstatus-introduced` タグを作成

## v5.0-tests-updated: テストの更新（Supabase 型ベース）

- [ ] API Route の単体テストを削除
- [ ] Server Action の単体テストを新規作成（Supabase 型使用）
- [ ] E2E テストが引き続きパスすることを確認
- [ ] 型安全なテストヘルパーの作成
- [ ] `v5.0-tests-updated` タグを作成

## demo/version-conflict: デモ用ブランチ

- [ ] 意図的にテストが失敗する変更を追加（依存関係バージョン不整合など）
- [ ] `demo/version-conflict` ブランチを作成

## ドキュメント

- [ ] 各バージョンの技術的差分の詳細説明
- [ ] 型設計方針の説明ドキュメント
- [ ] 学習者向けのステップごとの解説
