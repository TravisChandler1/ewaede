import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    // Test connection by fetching server timestamp
    const { data, error } = await supabase.rpc('now');
    
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase');
    console.log('🕒 Server time:', data);
    
    // Test querying a table
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
      
    if (tablesError) {
      console.warn('⚠️ Could not list tables, but connection is working:', tablesError.message);
    } else {
      console.log('\n📋 Available tables:');
      console.log(tables.map(t => t.tablename).join(', '));
    }
    
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:');
    console.error(error);
  }
}

testConnection();
