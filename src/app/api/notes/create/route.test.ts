/**
 * @jest-environment node
 */
import { POST } from "@/app/api/notes/create/route";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

// Supabaseクライアントをモック
jest.mock("@/lib/supabase/server");
const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;

describe("/api/notes/create", () => {
  // テスト中のconsole.errorを抑制
  const originalConsoleError = console.error;
  
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  const mockSupabase = {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  } as unknown as SupabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockCreateClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it("should create a note successfully", async () => {
    const mockNote = {
      id: "123",
      content: "Test note",
      created_at: "2024-01-01T00:00:00.000Z",
    };

    const mockChain = {
      single: jest.fn().mockResolvedValue({
        data: mockNote,
        error: null,
      }),
    };
    const selectMock = jest.fn().mockReturnValue(mockChain);
    const insertMock = jest.fn().mockReturnValue({ select: selectMock });
    const fromMock = jest.fn().mockReturnValue({ insert: insertMock });

    mockSupabase.from = fromMock;

    const request = new NextRequest("http://localhost:3000/api/notes/create", {
      method: "POST",
      body: JSON.stringify({ content: "Test note" }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.note).toEqual(mockNote);
    expect(fromMock).toHaveBeenCalledWith("notes");
  });

  it("should return error for empty content", async () => {
    const request = new NextRequest("http://localhost:3000/api/notes/create", {
      method: "POST",
      body: JSON.stringify({ content: "" }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Content is required");
  });

  it("should handle Supabase errors", async () => {
    const mockChain = {
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      }),
    };
    const selectMock = jest.fn().mockReturnValue(mockChain);
    const insertMock = jest.fn().mockReturnValue({ select: selectMock });
    const fromMock = jest.fn().mockReturnValue({ insert: insertMock });

    mockSupabase.from = fromMock;

    const request = new NextRequest("http://localhost:3000/api/notes/create", {
      method: "POST",
      body: JSON.stringify({ content: "Test note" }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to create note");
  });
});
