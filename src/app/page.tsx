import { createNote } from "@/app/notes/_actions";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/SubmitButton";
import { HomeClient } from "@/components/HomeClient";
import type { QueryData } from "@supabase/supabase-js";

export default async function Home() {
  const supabase = await createClient();
  const query = supabase
    .from("notes")
    .select()
    .order("created_at", { ascending: false });

  const { data: notes } = await query;

  // QueryDataで正確な型を取得
  type NotesData = QueryData<typeof query>;
  const notesData: NotesData = notes || [];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Simple Notes App
          </h1>
          <p className="text-gray-600">
            v5.0-tests-updated: Complete Server Components + Server Actions
            architecture
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create New Note
          </h2>
          <form action={createNote}>
            <div className="flex gap-3">
              <input
                type="text"
                name="content"
                placeholder="Enter your note content..."
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
              <SubmitButton />
            </div>
          </form>
        </div>

        <HomeClient initialNotes={notesData} />
      </div>
    </main>
  );
}
