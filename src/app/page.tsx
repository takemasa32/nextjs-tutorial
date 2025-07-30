'use client';

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Note, CreateNoteResponse } from '@/types/note'

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select()
          .order('created_at', { ascending: false });
        
        if (error) {
          setError('Failed to load notes');
        } else {
          setNotes(data || []);
        }
      } catch {
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [supabase]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNoteContent.trim()) {
      setError('Note content is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNoteContent }),
      });

      const result: CreateNoteResponse = await res.json();

      if (result.success && result.note) {
        setNotes([result.note, ...notes]);
        setNewNoteContent('');
      } else {
        setError(result.error || 'Failed to create note');
      }
    } catch {
      setError('Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading notes...</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Simple Notes App</h1>
        <p className="text-gray-600 mb-8">v1.0-initial: Traditional API Routes + fetch implementation</p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateNote} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Enter your note content..."
              className="flex-1 p-3 border rounded-lg text-black"
              disabled={submitting}
              required
            />
            <button 
              type="submit" 
              disabled={submitting || !newNoteContent.trim()} 
              className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {submitting ? 'Creating...' : 'Add Note'}
            </button>
          </div>
        </form>

        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notes yet. Create your first note above!
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Your Notes ({notes.length})</h2>
            <ul className="space-y-4">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link 
                    href={`/notes/${note.id}`}
                    className="block p-4 border rounded-lg bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-lg mb-2 group-hover:text-blue-600 transition-colors">{note.content}</p>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}