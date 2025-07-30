#!/usr/bin/env node
/**
 * Script to clear test data from the database
 * Run with: node scripts/clear-test-data.mjs
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function clearTestData() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    console.error("Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // eslint-disable-next-line no-console
    console.log("Clearing test data from notes table...");

    const { error } = await supabase
      .from("notes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all notes

    if (error) {
      console.error("Error clearing data:", error);
      process.exit(1);
    }

    // eslint-disable-next-line no-console
    console.log("✅ Test data cleared successfully");
    // eslint-disable-next-line no-console
    console.log("You can now start fresh with your notes app");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

clearTestData();
