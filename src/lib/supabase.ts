import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jkuhtoapjkvcohlxogyb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdWh0b2Fwamt2Y29obHhvZ3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjYxOTUsImV4cCI6MjA4NTEwMjE5NX0.qfc27KY_8AC4EtM1vJQRygW64H0oat1qztIdaXNGZ4U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
