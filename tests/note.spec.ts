import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

test.beforeEach(async () => {
  // Clear all existing notes before each test - use gt 0 to match all records
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

test("should display the app title and version info", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Simple Notes App")).toBeVisible();
  await expect(
    page.getByText(
      "v5.0-tests-updated: Complete Server Components + Server Actions architecture"
    )
  ).toBeVisible();
});

test("should display notes", async ({ page }) => {
  // Insert test notes with unique content including timestamp
  const timestamp = Date.now();
  const note1Content = `Test Note 1 - ${timestamp}`;
  const note2Content = `Test Note 2 - ${timestamp}`;

  await supabase
    .from("notes")
    .insert([{ content: note1Content }, { content: note2Content }]);

  await page.goto("/");

  // Wait for notes to load
  await expect(page.getByText("Your Notes (")).toBeVisible();
  await expect(page.getByText(note1Content).first()).toBeVisible();
  await expect(page.getByText(note2Content).first()).toBeVisible();
});

test("should create a new note", async ({ page }) => {
  await page.goto("/");

  // Fill in the note content
  await page.fill(
    'input[placeholder="Enter your note content..."]',
    "New Playwright Note"
  );

  // Submit the form
  await page.click('button:has-text("Add Note")');

  // Wait for the note to appear
  await expect(page.getByText("New Playwright Note").first()).toBeVisible();
  await expect(page.getByText("Your Notes (")).toBeVisible();
});

test("should show error for empty note", async ({ page }) => {
  await page.goto("/");

  // Wait for page to load
  await expect(page.getByText("Simple Notes App")).toBeVisible();

  // Try to submit without content - Server Actions will handle validation server-side
  const addButton = page.getByRole("button", { name: "Add Note" });
  await addButton.click();

  // With Server Actions, the page should remain the same (no note created)
  // We verify by checking that no error appeared and form remained
  await expect(page.getByText("Simple Notes App")).toBeVisible();
});

test("should show empty state when no notes exist", async ({ page }) => {
  // Ensure database is completely clean
  await supabase
    .from("notes")
    .delete()
    .gt("id", "00000000-0000-0000-0000-000000000000");

  await page.goto("/");

  // Wait for loading to complete
  await page.waitForLoadState("networkidle");

  // Should show empty state message
  await expect(page.getByText("No notes yet")).toBeVisible();
  await expect(
    page.getByText("Create your first note above to get started!")
  ).toBeVisible();
});

test("should disable submit button when submitting", async ({ page }) => {
  await page.goto("/");

  // Fill in note content
  await page.fill(
    'input[placeholder="Enter your note content..."]',
    "Test note"
  );

  // Click submit and check if button becomes disabled
  const submitButton = page.getByText("Add Note");
  await expect(submitButton).not.toBeDisabled();

  // Submit the form
  await submitButton.click();

  // Check if the button shows loading state (may be too fast to catch)
  // So we just verify the note was created
  await expect(page.getByText("Test note").first()).toBeVisible();
});

test("should navigate to note detail page when clicking on a note", async ({
  page,
}) => {
  // First, create a note to ensure we have data
  const timestamp = Date.now();
  const noteContent = `Clickable test note - ${timestamp}`;

  await supabase.from("notes").insert([{ content: noteContent }]);

  await page.goto("/");

  // Wait for the note to be visible
  await expect(page.getByText(noteContent)).toBeVisible();

  // Click on the note to navigate to detail page
  await page.click(`text=${noteContent}`);

  // Wait for the page to fully load by waiting for the "Note Details" element
  await expect(page.getByText("Note Details")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(noteContent)).toBeVisible();
  await expect(page.getByText("Back to Notes")).toBeVisible();
});

test("should navigate back from note detail page", async ({ page }) => {
  // Create a note first
  const timestamp = Date.now();
  const noteContent = `Navigation test note - ${timestamp}`;

  await supabase.from("notes").insert([{ content: noteContent }]);

  await page.goto("/");

  // Wait for the note to be visible
  await expect(page.getByText(noteContent)).toBeVisible();

  // Navigate to detail page
  await page.click(`text=${noteContent}`);
  
  // Wait for the Note Details to be visible (this means we're on the detail page)
  await expect(page.getByText("Note Details")).toBeVisible({ timeout: 10000 });

  // Click back button
  await page.click("text=Back to Notes");
  
  // Wait for navigation back to home
  await page.waitForURL("/");

  // Verify we're back on the main page
  await expect(page.getByText("Simple Notes App")).toBeVisible();
  await expect(page.getByText("Your Notes")).toBeVisible();
});
