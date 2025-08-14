import Link from "next/link";
import type { Note } from "@/types/utils";

interface NotesListProps {
  notes: Note[];
  searchQuery?: string;
  isSearching?: boolean;
}

export function NotesList({ notes, searchQuery, isSearching }: NotesListProps) {
  if (notes.length === 0) {
    if (isSearching && searchQuery) {
      return (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-1">
              No notes found
            </p>
            <p className="text-gray-600">
              No notes match your search for &quot;{searchQuery}&quot;
            </p>
          </div>
        </div>
      );
    }

    return (
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
          <p className="text-lg font-medium text-gray-900 mb-1">No notes yet</p>
          <p className="text-gray-600">
            Create your first note above to get started!
          </p>
        </div>
      </div>
    );
  }

  // 検索結果のハイライト機能
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const title =
    isSearching && searchQuery
      ? `Search Results for "${searchQuery}" (${notes.length})`
      : `Your Notes (${notes.length})`;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <div className="grid gap-4">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <p className="text-gray-900 flex-1 mr-4">
                {isSearching && searchQuery
                  ? highlightText(note.content, searchQuery)
                  : note.content}
              </p>
              <time className="text-sm text-gray-500 whitespace-nowrap">
                {new Date(note.created_at).toLocaleDateString()}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
