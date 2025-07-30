import type { Database } from './database.types'

// Supabaseテーブルの型エイリアス
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// 配列要素の型を抽出するユーティリティ
export type ArrayElement<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer U> ? U : never

export type InferArrayElement<T> = T extends ReadonlyArray<infer U> ? U : never

// Notes関連の型エイリアス
export type Note = Tables<'notes'>
export type NoteInsert = TablesInsert<'notes'>
export type NoteUpdate = TablesUpdate<'notes'>
