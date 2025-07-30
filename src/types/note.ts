// Using Supabase-generated types with utilities
import type { Note as SupabaseNote, NoteInsert } from './utils';

// Re-export Supabase types
export type Note = SupabaseNote;
export type CreateNoteData = Pick<NoteInsert, 'content'>;

// API request/response types
export type CreateNoteRequest = CreateNoteData;

export interface CreateNoteResponse {
  success: boolean;
  note?: Note;
  error?: string;
}
