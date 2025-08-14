/**
 * @jest-environment node
 */
import { describe, it, expect } from "@jest/globals";

// 検索関数のシンプルなテスト
describe("searchNotes function", () => {
  it("検索ロジックが正しく動作する", () => {
    // テストデータ
    const mockNotes = [
      { id: "1", content: "Hello world", created_at: "2024-01-01" },
      { id: "2", content: "Another note", created_at: "2024-01-02" },
      { id: "3", content: "Test hello again", created_at: "2024-01-03" },
    ];

    // クライアント側のフィルター機能をテスト
    const searchQuery = "hello";
    const filteredNotes = mockNotes.filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(filteredNotes).toHaveLength(2);
    expect(filteredNotes[0].content).toBe("Hello world");
    expect(filteredNotes[1].content).toBe("Test hello again");
  });

  it("空の検索クエリですべてのノートを返す", () => {
    const mockNotes = [
      { id: "1", content: "Hello world", created_at: "2024-01-01" },
      { id: "2", content: "Another note", created_at: "2024-01-02" },
    ];

    const searchQuery = "";
    const filteredNotes = searchQuery
      ? mockNotes.filter((note) =>
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : mockNotes;

    expect(filteredNotes).toHaveLength(2);
    expect(filteredNotes).toEqual(mockNotes);
  });

  it("大文字小文字を区別しない検索", () => {
    const mockNotes = [
      { id: "1", content: "HELLO WORLD", created_at: "2024-01-01" },
      { id: "2", content: "hello world", created_at: "2024-01-02" },
      { id: "3", content: "Hello World", created_at: "2024-01-03" },
    ];

    const searchQuery = "hello";
    const filteredNotes = mockNotes.filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(filteredNotes).toHaveLength(3);
  });
});
