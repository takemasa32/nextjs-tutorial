"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { NoteInsert } from "@/types/utils";

export async function createNote(formData: FormData) {
  const content = formData.get("content") as string;

  // バリデーション
  if (!content?.trim()) {
    throw new Error("Content is required");
  }

  // データベース操作
  const supabase = await createClient();
  
  // 型安全なクエリ定義
  const insertData: Pick<NoteInsert, 'content'> = { content: content.trim() };
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
