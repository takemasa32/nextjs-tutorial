"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createNote } from "@/app/notes/_actions";
import { Note } from "@/types/note";
import { SubmitButton } from "@/components/SubmitButton";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const query = supabase
          .from("notes")
          .select()
          .order("created_at", { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error("Failed to load notes:", error);
        } else {
          setNotes(data || []);
        }
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading notes...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Simple Notes App
          </h1>
          <p className="text-gray-600">
            v4.0-useformstatus-introduced: Modern loading state with
            useFormStatus
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

        {notes.length === 0 ? (
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Notes ({notes.length})
            </h2>
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id}>
                  <Link
                    href={`/notes/${note.id}`}
                    className="block p-6 border border-gray-200 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-relaxed">
                          {note.content}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
