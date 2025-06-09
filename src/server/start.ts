import { execSync } from 'child_process';
import path from 'path';

// Compile TypeScript and run the server
try {
  console.log('🔨 Compiling TypeScript...');
  execSync('tsc', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
  
  console.log('🚀 Starting server...');
  execSync('node dist/server/api.js', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}
