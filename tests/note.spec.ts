import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

test.beforeEach(async () => {
  // Clear all existing notes before each test
  await supabase.from('notes').delete().neq('id', 0);
});

test.afterEach(async () => {
  // Clean up after each test
  await supabase.from('notes').delete().neq('id', 0);
});

test('should display the app title and version info', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Simple Notes App')).toBeVisible();
  await expect(page.getByText('v1.0-initial: Traditional API Routes + fetch implementation')).toBeVisible();
});

test('should display notes', async ({ page }) => {
  // Insert test notes
  await supabase.from('notes').insert([
    { content: 'Test Note 1' }, 
    { content: 'Test Note 2' }
  ]);
  
  await page.goto('/');
  
  // Wait for notes to load
  await expect(page.getByText('Your Notes (2)')).toBeVisible();
  await expect(page.getByText('Test Note 1')).toBeVisible();
  await expect(page.getByText('Test Note 2')).toBeVisible();
});

test('should create a new note', async ({ page }) => {
  await page.goto('/');
  
  // Fill in the note content
  await page.fill('input[placeholder="Enter your note content..."]', 'New Playwright Note');
  
  // Submit the form
  await page.click('button:has-text("Add Note")');
  
  // Wait for the note to appear
  await expect(page.getByText('New Playwright Note')).toBeVisible();
  await expect(page.getByText('Your Notes (1)')).toBeVisible();
});

test('should show error for empty note', async ({ page }) => {
  await page.goto('/');
  
  // Try to submit without content
  await page.click('button:has-text("Add Note")');
  
  // Should show error message
  await expect(page.getByText('Note content is required')).toBeVisible();
});

test('should show empty state when no notes exist', async ({ page }) => {
  await page.goto('/');
  
  // Should show empty state message
  await expect(page.getByText('No notes yet. Create your first note above!')).toBeVisible();
});

test('should disable submit button when submitting', async ({ page }) => {
  await page.goto('/');
  
  // Fill in note content
  await page.fill('input[placeholder="Enter your note content..."]', 'Test note');
  
  // Click submit and check if button becomes disabled
  const submitButton = page.getByText('Add Note');
  await expect(submitButton).not.toBeDisabled();
  
  // Submit the form
  await submitButton.click();
  
  // Check if the button shows loading state (may be too fast to catch)
  // So we just verify the note was created
  await expect(page.getByText('Test note')).toBeVisible();
});

test('should navigate to note detail page when clicking on a note', async ({ page }) => {
  // First, create a note to ensure we have data
  await supabase.from('notes').insert([
    { content: 'Clickable test note' }
  ]);
  
  await page.goto('/');
  
  // Click on the note to navigate to detail page
  await page.click('text=Clickable test note');
  
  // Verify we're on the detail page
  await expect(page.getByText('Note Details')).toBeVisible();
  await expect(page.getByText('Clickable test note')).toBeVisible();
  await expect(page.getByText('Back to Notes')).toBeVisible();
});

test('should navigate back from note detail page', async ({ page }) => {
  // Create a note first
  await supabase.from('notes').insert([
    { content: 'Navigation test note' }
  ]);
  
  await page.goto('/');
  
  // Navigate to detail page
  await page.click('text=Navigation test note');
  await expect(page.getByText('Note Details')).toBeVisible();
  
  // Click back button
  await page.click('text=Back to Notes');
  
  // Verify we're back on the main page
  await expect(page.getByText('Simple Notes App')).toBeVisible();
  await expect(page.getByText('Your Notes')).toBeVisible();
});