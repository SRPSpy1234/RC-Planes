import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnznegycskcuavcyaafv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuem5lZ3ljc2tjdWF2Y3lhYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NTExOTYsImV4cCI6MjA3NDQyNzE5Nn0.6b5cK9ANS8jBHlDfb7S_RLl__bmo7wPQWveAx5LB0lE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
