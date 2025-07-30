import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { CreateNoteRequest, CreateNoteResponse } from "@/types/note";

export async function POST(request: NextRequest) {
  try {
    const body: CreateNoteRequest = await request.json();

    if (!body.content || body.content.trim() === "") {
      return NextResponse.json<CreateNoteResponse>(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notes")
      .insert({ content: body.content.trim() })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json<CreateNoteResponse>(
        { success: false, error: "Failed to create note" },
        { status: 500 }
      );
    }

    return NextResponse.json<CreateNoteResponse>({
      success: true,
      note: data,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json<CreateNoteResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
