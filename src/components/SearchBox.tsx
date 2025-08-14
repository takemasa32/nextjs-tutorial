"use client";

import { useState, useEffect, useTransition } from "react";
import { searchNotes } from "@/app/notes/_actions";
import type { Note } from "@/types/utils";

interface SearchBoxProps {
  onSearchResults: (results: Note[]) => void;
  onSearchQueryChange: (query: string) => void;
}

export function SearchBox({
  onSearchResults,
  onSearchQueryChange,
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // デバウンス機能付きの検索
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        startTransition(async () => {
          try {
            const results = await searchNotes(query);
            onSearchResults(results);
            onSearchQueryChange(query);
          } catch (error) {
            console.error("Search failed:", error);
            onSearchResults([]);
          }
        });
      } else {
        onSearchResults([]);
        onSearchQueryChange("");
      }
    }, 300); // 300msのデバウンス

    return () => clearTimeout(timeoutId);
  }, [query, onSearchResults, onSearchQueryChange]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {/* 検索アイコン */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="h-5 w-5 text-gray-400"
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
        </div>

        {/* クリアボタン */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            data-testid="search-clear-button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ローディングインジケーター */}
      {isPending && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}
