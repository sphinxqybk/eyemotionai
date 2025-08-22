/* PRODUCTION ENVIRONMENT VARIABLES - VITE COMPLIANT */

// Extract project ID from Supabase URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const projectId = supabaseUrl ? new URL(supabaseUrl).hostname.split('.')[0] : "nimyngpkksdzobzjjiaa";

export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbXluZ3Bra3Nkem9iempqaWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTM5NTksImV4cCI6MjA3MDU2OTk1OX0.k_LGj2tom155w3cJA6qUNQsTapyT8qKf84Oe15Yv9f4";