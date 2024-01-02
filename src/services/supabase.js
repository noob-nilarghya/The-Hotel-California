// code copy pasted from supabase

import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qtwzupmuwhxjnmcfvnek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3p1cG11d2h4am5tY2Z2bmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0ODk3MjcsImV4cCI6MjAxOTA2NTcyN30.dxHIURXIPQnztgfZnk-Vcs0i6pOrwdDRX0hUIPQO0l0';


const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;