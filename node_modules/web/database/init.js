import sql from '../src/app/api/utils/sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Ewa Ede database...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating database schema...');
    await sql.unsafe(schema);
    console.log('✅ Schema created successfully');

    // Read and execute sample data
    const sampleDataPath = path.join(__dirname, 'sample_data.sql');
    const sampleData = fs.readFileSync(sampleDataPath, 'utf8');
    
    console.log('📊 Inserting sample data...');
    await sql.unsafe(sampleData);
    console.log('✅ Sample data inserted successfully');

    console.log('🎉 Database initialization completed!');
    
    // Test the connection
    const result = await sql`SELECT COUNT(*) as count FROM courses`;
    console.log(`📚 Found ${result[0].count} courses in database`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

export default initializeDatabase;