import { Client } from 'pg';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Read and execute the main schema
    console.log('📋 Setting up database schema...');
    const schemaPath = join(__dirname, '../database/schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.code === '42P07') {
            // Table already exists, skip
            console.log('⚠️  Table already exists, skipping...');
          } else {
            console.error('❌ Error executing statement:', error.message);
          }
        }
      }
    }

    // Read and execute the admin schema
    console.log('👑 Setting up admin schema...');
    const adminSchemaPath = join(__dirname, '../database/admin_schema.sql');
    const adminSchemaSQL = readFileSync(adminSchemaPath, 'utf8');
    
    const adminStatements = adminSchemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of adminStatements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log('✅ Executed admin statement');
        } catch (error) {
          if (error.code === '42P07') {
            console.log('⚠️  Admin table already exists, skipping...');
          } else {
            console.error('❌ Error executing admin statement:', error.message);
          }
        }
      }
    }

    // Insert sample data
    console.log('📊 Inserting sample data...');
    const sampleDataPath = join(__dirname, '../database/sample_data.sql');
    const sampleDataSQL = readFileSync(sampleDataPath, 'utf8');
    
    const sampleStatements = sampleDataSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of sampleStatements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log('✅ Inserted sample data');
        } catch (error) {
          if (error.code === '23505') {
            // Duplicate key, skip
            console.log('⚠️  Sample data already exists, skipping...');
          } else {
            console.error('❌ Error inserting sample data:', error.message);
          }
        }
      }
    }

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the setup
setupDatabase();
