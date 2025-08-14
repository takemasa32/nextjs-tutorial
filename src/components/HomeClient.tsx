"use client";

import { useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { NotesList } from "@/components/NotesList";
import type { Note } from "@/types/utils";

interface HomeClientProps {
  initialNotes: Note[];
}

export function HomeClient({ initialNotes }: HomeClientProps) {
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isSearching = searchQuery.trim().length > 0;
  const displayNotes = isSearching ? searchResults : initialNotes;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Search Notes
        </h2>
        <SearchBox
          onSearchResults={setSearchResults}
          onSearchQueryChange={setSearchQuery}
        />
      </div>

      <NotesList
        notes={displayNotes}
        searchQuery={searchQuery}
        isSearching={isSearching}
      />
    </>
  );
}
