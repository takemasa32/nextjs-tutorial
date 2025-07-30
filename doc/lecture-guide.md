# 講義ガイド: モダン Next.js アプリケーション開発

## 概要

この講義では、従来の API Routes + fetch パターンから、モダンな Server Actions + useFormStatus パターンへの段階的リファクタリングを通じて、Next.js アプリケーション開発のベストプラクティスを学習します。

## 学習目標

- **段階的なモダン化**: 既存コードを段階的に改善する実践的なアプローチ
- **型安全性**: TypeScript と Supabase を使った型安全なデータアクセス
- **テスト駆動開発**: 単体テスト、E2E テストによる品質保証
- **Server Actions と Client Components**: Next.js App Router のベストプラクティス

## 講義構成

### Phase 1: 基盤理解（v1.0-initial）

**時間**: 45 分
**目的**: 伝統的な Next.js アプリケーションの理解と問題点の把握

#### 1.1 アーキテクチャ理解（15 分）

**学習内容**:

- API Routes（`/api/notes/create/route.ts`）の構造
- Client Component での`fetch`呼び出し
- `useState`を使った手動のローディング管理
- 個別型定義によるデータ管理

- **コード解説ポイント**:

  ```typescript
  // 伝統的なfetch実装
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/notes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      // エラーハンドリング、状態更新...
    } finally {
      setIsLoading(false);
    }
  };
  ```

- **問題点の指摘**:
  - クライアント・サーバー間のデータ同期
  - 手動のローディング状態管理
  - 型の重複定義
  - エラーハンドリングの複雑性

#### 1.2 型システムの課題（15 分）

- **個別型定義の問題**:

  ```typescript
  // types/note.ts - 個別に定義された型
  export interface Note {
    id: string;
    content: string;
    created_at: string;
  }

  // API Route内での重複
  interface CreateNoteRequest {
    content: string;
  }
  ```

- **データベースとの型不整合リスク**
- **型の「バケツリレー」問題**

#### 1.3 テスト戦略（15 分）

- **単体テスト**: API Route のテスト
- **E2E テスト**: ユーザーインタラクションのテスト
- **モックの使用法**: Supabase クライアントのモック

### Phase 2: Server Actions 導入（v2.0-action-created）

**時間**: 30 分
**目的**: 新しいデータ更新パターンの理解

#### 2.1 Server Actions の概念（10 分）

- **従来の API Routes との違い**
- **サーバーサイドでの直接実行**
- **型安全性の向上**

#### 2.2 実装（15 分）

```typescript
// app/notes/_actions.ts
"use server";

import { createServerComponentClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNote(formData: FormData) {
  const content = formData.get("content") as string;

  if (!content?.trim()) {
    throw new Error("Content is required");
  }

  const supabase = createServerComponentClient();
  const { error } = await supabase
    .from("notes")
    .insert({ content: content.trim() });

  if (error) {
    throw new Error("Failed to create note");
  }

  revalidatePath("/");
  redirect("/");
}
```

#### 2.3 共存期間の管理（5 分）

- **既存 UI は変更せずに新機能を追加**
- **段階的な移行の重要性**

### Phase 3: フォーム接続変更（v3.0-form-refactored）

**時間**: 25 分
**目的**: UI の接続先変更とパラダイムシフト

#### 3.1 フォーム実装の変更（15 分）

```typescript
// Before: fetch実装
const handleSubmit = async (e: FormEvent) => {
  // fetch logic...
};

// After: Server Action
<form action={createNote}>
  <input name="content" />
  <button type="submit">Add Note</button>
</form>;
```

#### 3.2 プログレッシブエンハンスメント（10 分）

- **JavaScript が無効でも動作**
- **ネイティブフォーム機能の活用**
- **アクセシビリティの向上**

### Phase 4: モダンなローディング管理（v4.0-useformstatus-introduced）

**時間**: 35 分
**目的**: useFormStatus フックとコンポーネント分離

#### 4.1 useFormStatus フックの理解（15 分）

```typescript
// components/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`transition-all ${pending ? "opacity-50" : ""}`}
    >
      {pending ? "Adding..." : "Add Note"}
    </button>
  );
}
```

#### 4.2 責務の分離（10 分）

- **フォームロジック**: Server Actions
- **UI 状態**: useFormStatus
- **表示ロジック**: コンポーネント分離

#### 4.3 パフォーマンスの向上（10 分）

- **自動的な状態管理**
- **不必要な再レンダリングの削減**
- **React 18 Concurrent の活用**

### Phase 5: テスト更新と型システム改善（v5.0-tests-updated）

**時間**: 40 分
**目的**: Supabase 型システムとテスト戦略の最適化

#### 5.1 Supabase 型システムの活用（20 分）

```typescript
// 自動生成される型を活用
import { Database } from "@/types/supabase";

type Note = Database["public"]["Tables"]["notes"]["Row"];
type CreateNoteData = Database["public"]["Tables"]["notes"]["Insert"];

// Server Actionsでの型安全な実装
export async function createNote(formData: FormData): Promise<void> {
  const data: CreateNoteData = {
    content: formData.get("content") as string,
  };
  // ...
}
```

#### 5.2 テスト戦略の変更（15 分）

- **API Route テストの削除**
- **Server Action テストの追加**
- **E2E テストの継続性**

#### 5.3 型の「バケツリレー」解決（5 分）

- **単一の真実の源（Single Source of Truth）**
- **型の透過的な伝搬**
- **メンテナンス性の向上**

## 実習課題

### 基礎課題

1. **v1.0 のコードレビュー**: 問題点の特定
2. **Server Action の実装**: 段階的な移行
3. **テストの実行**: 各段階での動作確認

### 発展課題

1. **ノート詳細表示機能**: 新しいページの追加
2. **ノート編集機能**: Server Actions での更新処理
3. **ノート削除機能**: 確認ダイアログ付きの削除

### 上級課題

1. **楽観的更新**: useOptimistic フックの活用
2. **無限スクロール**: Server Actions でのページネーション
3. **リアルタイム更新**: Supabase リアルタイム機能

## トラブルシューティングガイド

### よくある問題

#### 1. Server Actions が動作しない

```typescript
// 解決策: 'use server'ディレクティブの確認
"use server"; // ファイルの先頭に必須

export async function myAction() {
  // Server Action logic
}
```

#### 2. 型エラーが発生する

```typescript
// 解決策: Supabase型の正しい使用
import { Database } from "@/types/supabase";

// 正しい型の使用
type Tables = Database["public"]["Tables"];
type Note = Tables["notes"]["Row"];
```

#### 3. フォームが送信されない

```typescript
// 解決策: form要素とaction属性の確認
<form action={createNote}>
  {" "}
  {/* Server Actionを直接指定 */}
  <input name="content" required />
  <SubmitButton />
</form>
```

## 参考資料

### 公式ドキュメント

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [Supabase TypeScript Support](https://supabase.com/docs/guides/api/generating-types)

### ベストプラクティス

- [Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
- [Type-safe Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- [Testing Next.js Applications](https://nextjs.org/docs/app/building-your-application/testing)

### Phase 5: 完全な Server Components 化（v5.0-tests-updated）

**時間**: 40 分
**目的**: セキュリティとパフォーマンスの最適化

#### 5.1 Server Component 移行（15 分）

**セキュリティの向上**:

- NEXT*PUBLIC*環境変数の完全削除
- サーバーサイドのみでのデータベースアクセス
- 攻撃面の縮小

```typescript
// Before: Client Component
"use client";
import { createClient } from "@/lib/supabase/client";

// After: Server Component
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();
  // ...
}
```

#### 5.2 API Routes 削除（10 分）

**アーキテクチャの簡素化**:

- `/api/notes/create/route.ts`の削除
- Server Actions による完全な代替
- テストの簡素化

#### 5.3 最終的なアーキテクチャ（15 分）

**最適化された構成**:

- Server Component: 初期データ取得
- Server Actions: データ更新
- Client Component: インタラクティブ UI（SubmitButton のみ）

**利点の説明**:

- **パフォーマンス**: サーバーサイドレンダリング
- **セキュリティ**: 環境変数の適切な使用
- **開発体験**: 型安全性の完全実現

---

## 6. バージョン別比較表

| バージョン | データ取得       | データ更新     | 型システム    | 環境変数     | テスト         |
| ---------- | ---------------- | -------------- | ------------- | ------------ | -------------- |
| v1.0       | Client (fetch)   | API Routes     | 個別定義      | NEXT*PUBLIC* | API + E2E      |
| v2.0       | Client (fetch)   | Server Actions | Supabase 生成 | 両方併用     | API + SA + E2E |
| v3.0       | Client (fetch)   | Server Actions | Supabase 生成 | 両方併用     | SA + E2E       |
| v4.0       | Client (fetch)   | Server Actions | Supabase 生成 | 両方併用     | SA + E2E       |
| v5.0       | Server Component | Server Actions | Supabase 生成 | サーバーのみ | SA + E2E       |

## 評価基準

### 理解度チェック

- [ ] API Routes と Server Actions の違いを説明できる
- [ ] useFormStatus フックの使用目的を理解している
- [ ] Supabase 型システムの利点を説明できる
- [ ] テスト戦略の変更理由を理解している

### 実装スキル

- [ ] Server Actions を正しく実装できる
- [ ] 型安全なデータアクセスができる
- [ ] 適切なテストを書ける
- [ ] エラーハンドリングができる

### 応用力

- [ ] 新機能を既存アーキテクチャに統合できる
- [ ] パフォーマンスを考慮した実装ができる
- [ ] アクセシビリティに配慮できる
- [ ] セキュリティを意識した実装ができる
