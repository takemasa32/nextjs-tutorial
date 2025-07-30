import Link from "next/link";
import { createNote } from "@/app/notes/_actions";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/SubmitButton";
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
            v5.0-tests-updated: Complete Server Components + Server Actions architecture
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

        {notesData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-1">
                No notes yet
              </p>
              <p className="text-gray-600">
                Create your first note above to get started!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Your Notes ({notesData.length})
            </h2>
            <div className="grid gap-4">
              {notesData.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-900 flex-1 mr-4">{note.content}</p>
                    <time className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(note.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
