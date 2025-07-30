// v1.0-initial: Individual type definitions
// Later versions will use Supabase-generated types

export interface Note {
  id: string;
  content: string;
  created_at: string;
}

export interface CreateNoteRequest {
  content: string;
}

export interface CreateNoteResponse {
  success: boolean;
  note?: Note;
  error?: string;
}
