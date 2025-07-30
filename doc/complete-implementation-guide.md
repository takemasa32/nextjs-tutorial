# 講義用サンプルアプリケーション実装ガイド（詳細版）

## 概要

このガイドでは、Next.js + Supabase を使用した「予約メモ管理アプリ」の段階的実装について説明します。
v1.0（従来型）からv5.0（最新型）まで、5つの段階を通じて実装の進化を体験できます。

---

## 各バージョンの詳細実装ガイド

### v1.0-initial（現在完成済み）

**【目的】** テストされた従来的な実装を理解する

**【特徴】**
- API Routes (`/api/notes/create/route.ts`) を使用
- クライアントサイドで `fetch` を使用してAPIを呼び出し
- `useState` による手動のローディング状態管理
- 個別に定義された型システム

**【実装済み機能】**
✅ ノート一覧表示  
✅ ノート作成  
✅ ノート詳細表示  
✅ 統一されたライトテーマUI  
✅ 包括的なテストカバレッジ（単体テスト + E2E）  
✅ テストの冪等性（複数回実行可能）  

**【コード構造】**
```
src/
├── app/
│   ├── api/notes/create/
│   │   ├── route.ts          # API Route
│   │   └── route.test.ts     # API Routeのテスト
│   ├── notes/[id]/
│   │   └── page.tsx          # ノート詳細ページ
│   └── page.tsx              # メインページ（fetch使用）
├── lib/supabase/
│   ├── client.ts             # クライアントサイドSupabase
│   └── server.ts             # サーバーサイドSupabase
└── types/
    └── note.ts               # 型定義
```

**【講義ポイント】**
- 従来のWebアプリケーション開発パターン
- クライアント・サーバー間の明確な分離
- 手動のローディング状態管理の課題
- 型安全性の確保方法

---

### v2.0-action-created（次に実装予定）

**【目的】** Server Actionsを既存実装と並行して作成

**【変更内容】**
- `app/notes/_actions.ts` を新規作成
- `createNote` Server Action を実装
- **UI側は変更せず**、v1.0と同じ動作を維持

**【実装方針】**
```typescript
// app/notes/_actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNote(formData: FormData) {
  const content = formData.get('content') as string;
  
  if (!content?.trim()) {
    throw new Error('Content is required');
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('notes')
    .insert({ content: content.trim() });

  if (error) {
    throw new Error('Failed to create note');
  }

  revalidatePath('/');
  redirect('/');
}
```

**【講義ポイント】**
- Server Actionsの基本概念
- `'use server'` ディレクティブの役割
- `revalidatePath`によるキャッシュ戦略
- 従来のAPIとの共存

---

### v3.0-form-refactored（予定）

**【目的】** フォームをServer Actionsに接続

**【変更内容】**
- `NoteForm.tsx` の`onSubmit`ハンドラを削除
- `<form action={createNote}>` に変更
- API Route への `fetch` 呼び出しを削除

**【Before/After比較】**
```typescript
// Before (v2.0まで)
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  
  const response = await fetch('/api/notes/create', {
    method: 'POST',
    body: JSON.stringify({ content: newNoteContent }),
  });
  // ...
};

return <form onSubmit={handleSubmit}>

// After (v3.0)
return <form action={createNote}>
```

**【講義ポイント】**
- Progressive Enhancement の概念
- JavaScript無効化時の動作保証
- フォームの自動リセット

---

### v4.0-useformstatus-introduced（予定）

**【目的】** モダンなローディング状態管理

**【変更内容】**
- `SubmitButton.tsx` を新規作成
- `useFormStatus` フックを使用
- `useState` による手動ローディング管理を削除

**【新コンポーネント】**
```typescript
// components/SubmitButton.tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="..."
    >
      {pending ? 'Creating...' : 'Add Note'}
    </button>
  );
}
```

**【講義ポイント】**
- React 19の新機能
- コンポーネント間でのstate共有
- 宣言的なUI表現

---

### v5.0-tests-updated（予定）

**【目的】** テストをモダンアーキテクチャに対応

**【変更内容】**
- `route.test.ts` を削除（API Routeが不要になるため）
- `_actions.test.ts` を拡張
- E2Eテストは変更なし（ユーザー体験は同じため）

**【テスト戦略】**
```typescript
// _actions.test.ts
describe('Server Actions', () => {
  it('should create note with form data', async () => {
    const formData = new FormData();
    formData.append('content', 'Test note');
    
    await expect(createNote(formData)).rejects.toThrow('NEXT_REDIRECT');
    expect(supabase.from).toHaveBeenCalledWith('notes');
  });
});
```

**【講義ポイント】**
- Server Actionsのテスト手法
- モックの適切な使用
- リダイレクトのテスト方法

---

## 型システムの進化

### v1.0: 個別型定義
```typescript
// types/note.ts
export interface Note {
  id: string;
  content: string;
  created_at: string;
}
```

### v2.0以降: Supabaseベース型システム
```typescript
// lib/supabase/types.ts（自動生成）
export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          created_at?: string;
        };
      };
    };
  };
};

// services/noteService.ts
export const fetchNotes = async () => {
  const query = supabase.from('notes').select('*');
  const { data, error } = await query;
  return data as QueryData<typeof query>;
};

// hooks/useNotes.ts
export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });
};

// components/NoteList.tsx
type Notes = Awaited<ReturnType<typeof fetchNotes>>;
type Note = Notes[number];

interface Props {
  notes: Notes;
}
```

---

## 実装スケジュール

| バージョン | 実装時間 | 重点項目 |
|-----------|----------|----------|
| v1.0-initial | **完了** | 従来型実装とテスト基盤 |
| v2.0-action-created | 30分 | Server Actions作成 |
| v3.0-form-refactored | 20分 | フォーム接続変更 |
| v4.0-useformstatus-introduced | 25分 | モダンローディング |
| v5.0-tests-updated | 35分 | テスト更新と最終確認 |

---

## 各段階での学習効果

### v1.0 → v2.0
- Server Actionsの基本概念
- サーバーサイド処理の利点

### v2.0 → v3.0  
- Progressive Enhancement
- フォーム処理の簡素化

### v3.0 → v4.0
- React 19の新機能活用
- 宣言的ローディング状態管理

### v4.0 → v5.0
- テスト戦略の変更
- アーキテクチャ進化に伴うテスト調整

---

## トラブルシューティング

### よくある問題と解決方法

**1. Server Actionsでリダイレクトエラー**
```typescript
// 解決方法: redirect は必ず例外を投げる
try {
  redirect('/');
} catch (error) {
  // これは正常な動作
}
```

**2. useFormStatus が動作しない**
```typescript
// 問題: form の外で使用
function SubmitButton() {
  const { pending } = useFormStatus(); // ❌
}

// 解決: form の内部コンポーネントで使用
function MyForm() {
  return (
    <form action={createNote}>
      <SubmitButton /> {/* ✅ */}
    </form>
  );
}
```

**3. 型エラーの解決**
```typescript
// 問題: any の使用
const data: any = await response.json(); // ❌

// 解決: 適切な型注釈
type CreateNoteResponse = {
  success: boolean;
  note?: Note;
  error?: string;
};
const data: CreateNoteResponse = await response.json(); // ✅
```

---

## まとめ

この段階的実装を通じて、以下を学習できます：

1. **従来型 → モダン型** への移行プロセス
2. **段階的リファクタリング** の手法
3. **テスト駆動開発** の実践
4. **Next.js 15 + React 19** の最新機能
5. **型安全性** の確保方法

各段階で実際に動作するアプリケーションを保持しながら、安全に進化させることができます。
