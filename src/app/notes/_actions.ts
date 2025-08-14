"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { NoteInsert, Note } from "@/types/utils";

export async function createNote(formData: FormData) {
  const content = formData.get("content") as string;

  // バリデーション
  if (!content?.trim()) {
    throw new Error("Content is required");
  }

  // データベース操作
  const supabase = await createClient();

  // 型安全なクエリ定義
  const insertData: Pick<NoteInsert, "content"> = { content: content.trim() };
  const query = supabase.from("notes").insert(insertData);

  const { error } = await query;

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to create note");
  }

  // キャッシュ無効化とリダイレクト
  revalidatePath("/");
  redirect("/");
}

export async function searchNotes(query: string): Promise<Note[]> {
  // 検索クエリのバリデーション
  if (!query?.trim()) {
    return [];
  }

  const supabase = await createClient();

  // PostgreSQLの全文検索を使用（ilike演算子で部分一致検索）
  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .ilike("content", `%${query.trim()}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Search error:", error);
    throw new Error("Failed to search notes");
  }

  return notes || [];
}
