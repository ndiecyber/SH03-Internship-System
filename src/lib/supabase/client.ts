import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk digunakan di Client Components (browser).
 * Menggunakan singleton pattern agar tidak membuat instance baru setiap render.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
