import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Anon Key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    // Test connection by fetching server timestamp
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase');
    console.log('📊 Found users:', data);
    
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:');
    console.error(error);
  }
}

testConnection();
