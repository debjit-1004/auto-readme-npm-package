import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Loads configuration from default config and user config
 * @returns {Object} Merged configuration
 */
export async function loadConfig() {
  try {
    // Load default config
    const defaultConfigPath = path.resolve(__dirname, '../config/default.json');
    const defaultConfig = JSON.parse(await readFile(defaultConfigPath, 'utf8'));
    
    // Try to load user config
    let userConfig = {};
    try {
      const userConfigPath = path.resolve(process.cwd(), 'readme-gen.config.json');
      userConfig = JSON.parse(await readFile(userConfigPath, 'utf8'));
    } catch (error) {
      // User config is optional
    }
    
    // Merge configs
    return {
      ...defaultConfig,
      ...userConfig,
    };
  } catch (error) {
    console.error('Failed to load configuration:', error);
    process.exit(1);
  }
}