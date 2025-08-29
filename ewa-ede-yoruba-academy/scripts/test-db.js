const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // For testing purposes only
  }
});

async function testConnection() {
  console.log('🔌 Testing database connection...');
  
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to the database');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('\n📊 Database version:');
    console.log(result.rows[0].version);
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )`);
      
    console.log('\n📋 Database tables:');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Available tables:', tables.rows.map(r => r.table_name));
    
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to the database:');
    console.error(error);
  } finally {
    await pool.end();
  }
}

testConnection();
