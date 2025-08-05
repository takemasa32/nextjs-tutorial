import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/types/note";
import BackButton from "@/components/BackButton";

interface NoteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getNoteById(id: string): Promise<Note | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Database error:", error);
    return null;
  }

  return data;
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Simple Notes App
                </h1>
                <p className="text-gray-600 mt-1">
                  v5.0-tests-updated: Complete Server Components architecture
                </p>
              </div>
              <BackButton className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Notes
              </BackButton>
            </div>
          </div>

          {/* Note Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Note Details Header */}
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Note Details
              </h2>
              <p className="text-sm text-gray-600">
                Created:{" "}
                {new Date(note.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Note Content */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              {/* Note Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">
                      Note ID:
                    </span>
                    <code className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {note.id}
                    </code>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">
                      Created at:
                    </span>
                    <span className="text-sm text-gray-700">
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
