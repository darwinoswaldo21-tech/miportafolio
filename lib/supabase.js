import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dgxfqjjfwbgbwpuxgydp.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneGZxampmd2JnYndwdXhneWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDY4NTUsImV4cCI6MjA4OTg4Mjg1NX0.xqa47xNK7tmJ5tLCUCKNGcbXO8iN1-5v342538vl3Zg'

export const supabase = createClient(supabaseUrl, supabaseKey) 
