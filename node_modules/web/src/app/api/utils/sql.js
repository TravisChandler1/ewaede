import postgres from 'postgres';

const NullishQueryFunction = () => {
  throw new Error(
    'No database connection string was provided. Please set DATABASE_URL environment variable with your Supabase connection string'
  );
};

NullishQueryFunction.transaction = () => {
  throw new Error(
    'No database connection string was provided. Please set DATABASE_URL environment variable with your Supabase connection string'
  );
};

// Create postgres connection using Supabase connection string
// Supabase provides a direct PostgreSQL connection string
const sql = process.env.DATABASE_URL 
  ? postgres(process.env.DATABASE_URL, {
      // Supabase-specific configuration
      ssl: 'require',
      max: 10, // Connection pool size
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : NullishQueryFunction;

export default sql;