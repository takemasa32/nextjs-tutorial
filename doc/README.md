# 講義用サンプルアプリ: Simple Notes App

## 1. 概要

このプロジェクトは、Next.js と Supabase を用いた Web アプリケーション開発の講習用サンプルです。

**コンセプト:**
講義の進行に合わせて、古い実装からモダンな実装へと段階的にリファクタリングを行い、さらにテストを追加していくことで、実践的な開発プロセスを体験することを目的としています。

**学習ポイント:**

- 伝統的な API Routes + fetch から Server Actions への移行
- 個別型定義から Supabase 由来の型システムへの移行
- useState 手動管理から useFormStatus を使ったモダンな状態管理
- 段階的リファクタリングのベストプラクティス
- テストファーストな開発フロー

## 2. 技術スタック

- **フレームワーク:** Next.js (App Router), React
- **言語:** TypeScript
- **データベース:** Supabase (PostgreSQL)
- **スタイリング:** Tailwind CSS
- **テスト:**
  - 単体テスト: Jest
  - E2E テスト: Playwright

## 3. データベーススキーマ

**テーブル名:** `notes`

**カラム:**

- `id`: `uuid` (主キー)
- `content`: `text` (メモの本文)
- `created_at`: `timestamp with time zone` (デフォルト値: `now()`)

## 4. 環境変数設定

このアプリケーションでは Supabase への接続に 2 つの異なる環境変数セットを使用します：

### クライアントサイド用（v1.0 のみ）

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### サーバーサイド用（v2.0 以降推奨）

```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**設計思想:**

- v1.0: クライアントサイドでの Supabase 直接アクセス
- v2.0 以降: サーバーサイドでのみ Supabase アクセス、セキュリティ向上
- クライアントは Server Actions 経由でデータ操作

## 5. バージョン別実装詳細

## 4. バージョン別学習内容

### v1.0-initial: 伝統的実装

**学習目標:** 既存の一般的な実装パターンを理解する

**特徴:**

- 個別に定義した型システム (`/src/types/note.ts`)
- API Routes (`/api/notes/create/route.ts`) を使用
- クライアントサイドで fetch によるデータ送信
- useState による手動ローディング状態管理
- 詳細なエラーハンドリング

**ファイル構成:**

```text
src/
├── types/note.ts                    # 個別型定義
├── app/api/notes/create/route.ts    # API Route
├── app/page.tsx                     # メインページ（fetch使用）
└── lib/supabase/                    # Supabaseクライアント
```

### v2.0-action-created: Server Action 準備

**学習目標:** 新しいアーキテクチャを既存システムと並行で準備する

**特徴:**

- Supabase 由来の型システム導入
- Server Action 実装（まだ UI 側は使用せず）
- 型ヘルパーユーティリティの作成
- 既存 UI は変更せず内部実装のみ拡張

### v3.0-form-refactored: フォーム接続変更

**学習目標:** UI レイヤーを Server Action に接続する

**特徴:**

- フォームコンポーネントの分離
- fetch 処理の削除、form action 使用
- Server-first なデータフロー

### v4.0-useformstatus-introduced: モダンな状態管理

**学習目標:** React 18+のモダンなフォーム状態管理を学ぶ

**特徴:**

- useFormStatus フック使用
- useState 手動管理からの脱却
- React Server Components + Client Components の適切な分離

### v5.0-tests-updated: テスト更新

**学習目標:** アーキテクチャ変更に伴うテスト戦略の変更

**特徴:**

- API Route 単体テスト → Server Action 単体テスト
- Supabase 型ベースのテストヘルパー
- E2E テストの継続性確認

## 5. 型設計戦略

### v1.0: 個別型定義

```typescript
// src/types/note.ts
export interface Note {
  id: string;
  content: string;
  created_at: string;
}
```

### v2.0 以降: Supabase 型ベース

```typescript
// Supabase CLIから生成
import { Database } from "@/lib/database.types";
type Note = Database["public"]["Tables"]["notes"]["Row"];

// 型ヘルパー
export type ArrayElement<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer U> ? U : never;
```

## 7. 学習の進め方

1. **v1.0-initial** でテストを実行し、従来実装を理解
2. **v2.0-action-created** で新しいアーキテクチャの準備を確認
3. **v3.0-form-refactored** で UI 接続の変更を理解
4. **v4.0-useformstatus-introduced** でモダンな状態管理を学習
5. **v5.0-tests-updated** でテスト戦略の変更を確認

各ステップで必ずテストを実行し、機能が正常に動作することを確認してください。

## 8. デモ/トラブルシューティング

**demo/version-conflict** ブランチでは、意図的にテストが失敗するケースを用意しています。
これにより、「テストがあることでバージョン不整合によるデグレードを検知できる」ことを実演できます。

詳細はルートディレクトリの `README.md` を参照してください。
