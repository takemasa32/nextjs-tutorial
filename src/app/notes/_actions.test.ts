/**
 * @jest-environment node
 */
import { createNote } from "./_actions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// モック設定
jest.mock("@/lib/supabase/server");
jest.mock("next/cache");
jest.mock("next/navigation");

const mockSupabase = {
  from: jest.fn().mockReturnValue({
    insert: jest.fn().mockReturnValue({
      error: null,
    }),
  }),
};

describe("Server Actions - createNote", () => {
  // テスト中のconsole.errorを抑制
  const originalConsoleError = console.error;
  
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
    (redirect as unknown as jest.Mock).mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
  });

  it("should create a note successfully", async () => {
    const formData = new FormData();
    formData.append("content", "Test note content");

    await expect(createNote(formData)).rejects.toThrow("NEXT_REDIRECT");

    // redirectが呼ばれるため例外が発生するが、正常な動作
    expect(mockSupabase.from).toHaveBeenCalledWith("notes");
    expect(mockSupabase.from().insert).toHaveBeenCalledWith({
      content: "Test note content",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("should throw error for empty content", async () => {
    const formData = new FormData();
    formData.append("content", "");

    await expect(createNote(formData)).rejects.toThrow("Content is required");

    expect(mockSupabase.from).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should throw error for whitespace-only content", async () => {
    const formData = new FormData();
    formData.append("content", "   ");

    await expect(createNote(formData)).rejects.toThrow("Content is required");

    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should handle Supabase errors", async () => {
    const mockSupabaseWithError = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          error: { message: "Database error" },
        }),
      }),
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabaseWithError);

    const formData = new FormData();
    formData.append("content", "Test content");

    await expect(createNote(formData)).rejects.toThrow("Failed to create note");

    expect(mockSupabaseWithError.from().insert).toHaveBeenCalledWith({
      content: "Test content",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should trim content before saving", async () => {
    const formData = new FormData();
    formData.append("content", "  Test with spaces  ");

    await expect(createNote(formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(mockSupabase.from().insert).toHaveBeenCalledWith({
      content: "Test with spaces",
    });
  });
});
