const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: "postgresql://postgres:Oladeni%40123@db.nopsgzfaehuijfxxeanj.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false // For testing purposes only
  }
});

async function testConnection() {
  console.log('🔌 Testing database connection with encoded password...');
  
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to the database');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('\n📊 Database version:');
    console.log(result.rows[0].version);
    
    // List all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📋 Available tables:');
    console.log(tables.rows.map(r => r.table_name).join(', '));
    
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to the database:');
    console.error(error);
  } finally {
    await pool.end();
  }
}

testConnection();
