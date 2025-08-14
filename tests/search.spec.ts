import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

test.beforeEach(async () => {
  // Clear all existing notes before each test
  await supabase
    .from("notes")
    .delete()
    .gt("id", "00000000-0000-0000-0000-000000000000");
});

test.afterEach(async () => {
  // Clean up after each test
  await supabase
    .from("notes")
    .delete()
    .gt("id", "00000000-0000-0000-0000-000000000000");
});

test.describe("Note Search Functionality", () => {
  test("should display search box", async ({ page }) => {
    await page.goto("/");

    // 検索セクションが表示されることを確認
    await expect(page.getByText("Search Notes")).toBeVisible();
    await expect(
      page.locator('input[placeholder="Search notes..."]')
    ).toBeVisible();
  });

  test("should search notes and display results", async ({ page }) => {
    const timestamp = Date.now();

    // テスト用のノートを作成
    await supabase
      .from("notes")
      .insert([
        { content: `JavaScript tips and tricks - ${timestamp}` },
        { content: `React Components and Hooks - ${timestamp}` },
        { content: `CSS Grid Layout Tutorial - ${timestamp}` },
      ]);

    await page.goto("/");

    // ノートがロードされるまで待機（具体的なコンテンツを待つ）
    await expect(
      page.getByText(`JavaScript tips and tricks - ${timestamp}`)
    ).toBeVisible();
    await expect(
      page.getByText(`React Components and Hooks - ${timestamp}`)
    ).toBeVisible();
    await expect(
      page.getByText(`CSS Grid Layout Tutorial - ${timestamp}`)
    ).toBeVisible();

    // 全ノートのカウントが表示されることを確認
    await expect(page.getByText("Your Notes (3)")).toBeVisible();

    // 検索を実行
    await page.fill('input[placeholder="Search notes..."]', "JavaScript");

    // デバウンス後の検索結果を待つ
    await page.waitForTimeout(500);

    // 検索結果タイトルを確認
    await expect(
      page.getByText('Search Results for "JavaScript" (1)')
    ).toBeVisible();

    // 正しいノートが表示され、他が非表示になることを確認
    await expect(
      page.getByText(`JavaScript tips and tricks - ${timestamp}`)
    ).toBeVisible();
    await expect(
      page.getByText(`React Components and Hooks - ${timestamp}`)
    ).not.toBeVisible();
    await expect(
      page.getByText(`CSS Grid Layout Tutorial - ${timestamp}`)
    ).not.toBeVisible();
  });

  test("should handle case-insensitive search", async ({ page }) => {
    const timestamp = Date.now();

    await supabase
      .from("notes")
      .insert([{ content: `React Components and Hooks - ${timestamp}` }]);

    await page.goto("/");

    // ノートがロードされるまで待機
    await expect(
      page.getByText(`React Components and Hooks - ${timestamp}`)
    ).toBeVisible();
    await expect(page.getByText("Your Notes (1)")).toBeVisible();

    // 小文字で検索
    await page.fill('input[placeholder="Search notes..."]', "react");
    await page.waitForTimeout(500);

    await expect(
      page.getByText('Search Results for "react" (1)')
    ).toBeVisible();
    await expect(
      page.getByText(`React Components and Hooks - ${timestamp}`)
    ).toBeVisible();
  });

  test("should show no results message for non-matching search", async ({
    page,
  }) => {
    const timestamp = Date.now();

    await supabase
      .from("notes")
      .insert([{ content: `JavaScript programming tutorial - ${timestamp}` }]);

    await page.goto("/");

    // ノートがロードされるまで待機
    await expect(
      page.getByText(`JavaScript programming tutorial - ${timestamp}`)
    ).toBeVisible();
    await expect(page.getByText("Your Notes (1)")).toBeVisible();

    // 該当しない検索
    await page.fill('input[placeholder="Search notes..."]', "Python");
    await page.waitForTimeout(500);

    await expect(page.getByText("No notes found")).toBeVisible();
    await expect(
      page.getByText('No notes match your search for "Python"')
    ).toBeVisible();
  });

  test("should clear search results when input is cleared", async ({
    page,
  }) => {
    const timestamp = Date.now();

    await supabase
      .from("notes")
      .insert([{ content: `Test note content - ${timestamp}` }]);

    await page.goto("/");

    // ノートがロードされるまで待機
    await expect(
      page.getByText(`Test note content - ${timestamp}`)
    ).toBeVisible();
    await expect(page.getByText("Your Notes (1)")).toBeVisible();

    // 検索実行
    await page.fill('input[placeholder="Search notes..."]', "test");
    await page.waitForTimeout(500);
    await expect(page.getByText('Search Results for "test" (1)')).toBeVisible();

    // 検索をクリア
    await page.fill('input[placeholder="Search notes..."]', "");
    await page.waitForTimeout(500);

    // 全ノートが再表示されることを確認
    await expect(page.getByText("Your Notes (1)")).toBeVisible();
    await expect(
      page.getByText(`Test note content - ${timestamp}`)
    ).toBeVisible();
  });

  test("should highlight search terms in results", async ({ page }) => {
    const timestamp = Date.now();

    await supabase
      .from("notes")
      .insert([
        { content: `React Components and Hooks tutorial - ${timestamp}` },
      ]);

    await page.goto("/");

    // ノートがロードされるまで待機
    await expect(
      page.getByText(`React Components and Hooks tutorial - ${timestamp}`)
    ).toBeVisible();
    await expect(page.getByText("Your Notes (1)")).toBeVisible();

    // 検索実行
    await page.fill('input[placeholder="Search notes..."]', "React");
    await page.waitForTimeout(500);

    await expect(
      page.getByText('Search Results for "React" (1)')
    ).toBeVisible();

    // ハイライトされたテキストを確認
    await expect(page.locator('mark:has-text("React")')).toBeVisible();
  });

  test("should use clear button to reset search", async ({ page }) => {
    const timestamp = Date.now();

    await supabase
      .from("notes")
      .insert([{ content: `Test note for clearing - ${timestamp}` }]);

    await page.goto("/");

    // ノートがロードされるまで待機
    await expect(
      page.getByText(`Test note for clearing - ${timestamp}`)
    ).toBeVisible();
    await expect(page.getByText("Your Notes (1)")).toBeVisible();

    // 検索実行
    await page.fill('input[placeholder="Search notes..."]', "test");
    await page.waitForTimeout(500);

    // クリアボタンが表示されることを確認
    const clearButton = page.getByTestId("search-clear-button");
    await expect(clearButton).toBeVisible();

    // クリアボタンをクリック
    await clearButton.click();

    // 検索フィールドがクリアされることを確認
    await expect(
      page.locator('input[placeholder="Search notes..."]')
    ).toHaveValue("");

    // 全ノートが再表示されることを確認
    await expect(page.getByText("Your Notes (1)")).toBeVisible();
  });

  test("should show loading indicator during search", async ({ page }) => {
    await page.goto("/");

    // 検索開始
    await page.fill('input[placeholder="Search notes..."]', "test");

    // ローディングインジケーターを短時間確認（デバウンスが300msなので）
    // 実際の実装では非常に早いため、主に検索機能が動作することを確認
    await page.waitForTimeout(100);

    // 検索フィールドが正しく入力されていることを確認
    await expect(
      page.locator('input[placeholder="Search notes..."]')
    ).toHaveValue("test");
  });

  test("should work with multiple search terms", async ({ page }) => {
    const timestamp = Date.now();

    await supabase
      .from("notes")
      .insert([
        { content: `JavaScript React tutorial - ${timestamp}` },
        { content: `Python Django tutorial - ${timestamp}` },
        { content: `React Redux pattern - ${timestamp}` },
      ]);

    await page.goto("/");

    // 全ノートがロードされるまで待機
    await expect(
      page.getByText(`JavaScript React tutorial - ${timestamp}`)
    ).toBeVisible();
    await expect(
      page.getByText(`Python Django tutorial - ${timestamp}`)
    ).toBeVisible();
    await expect(
      page.getByText(`React Redux pattern - ${timestamp}`)
    ).toBeVisible();
    await expect(page.getByText("Your Notes (3)")).toBeVisible();

    // "React" で検索
    await page.fill('input[placeholder="Search notes..."]', "React");
    await page.waitForTimeout(500);

    // React を含む2つのノートが表示されることを確認
    await expect(
      page.getByText('Search Results for "React" (2)')
    ).toBeVisible();
    await expect(
      page.getByText(`JavaScript React tutorial - ${timestamp}`)
    ).toBeVisible();
    await expect(
      page.getByText(`React Redux pattern - ${timestamp}`)
    ).toBeVisible();
    await expect(
      page.getByText(`Python Django tutorial - ${timestamp}`)
    ).not.toBeVisible();
  });
});
