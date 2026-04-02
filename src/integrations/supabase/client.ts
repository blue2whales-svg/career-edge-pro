import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://wspugvdwodqdlyamxzxj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcHVndmR3b2RxZGx5YW14enhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODE5OTQsImV4cCI6MjA4ODk1Nzk5NH0.nW2OFx1oZKzjU5G0SRoQLvdaLi9wQKb3h6zDuGDQbwU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
