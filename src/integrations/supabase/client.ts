import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://runhjeuvxkxkmknogncz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bmhqZXV2eGt4a21rbm9nbmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDkwMTEsImV4cCI6MjA4NTcyNTAxMX0.QdJTcBxZpnM1PVDWTRlykwdlfWr1LdFc7fFcNx3VY6A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
