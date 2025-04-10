#!/usr/bin/env node
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'enquirer';
const { Confirm, Input, Select } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function initializeProject() {
  console.log('📝 Initializing auto-readme configuration...');

  const apiKeyPrompt = new Input({
    name: 'apiKey',
    message: 'Enter your GROQ API key (leave empty to add later in .env)',
    validate: value => true
  });
  
  const apiKey = await apiKeyPrompt.run();
  
  const modelPrompt = new Select({
    name: 'model',
    message: 'Select AI model to use:',
    choices: [
      'llama3-8b-8192',
      'llama3-70b-8192',
      'gemma-7b-it',
      'mixtral-8x22b-32768',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ],
    initial: 1
  });
  
  const model = await modelPrompt.run();
  
  const watchPathsPrompt = new Input({
    name: 'watchPaths',
    message: 'Enter paths to watch (comma separated):',
    initial: 'src/**/*,package.json'
  });
  
  const watchPaths = await watchPathsPrompt.run();
  
  // Create config file
  const config = {
    watchPaths: watchPaths.split(',').map(p => p.trim()),
    ignorePatterns: ["**/node_modules/**", "**/dist/**"],
    model: model,
    templatePath: "./templates/readme-template.md",
    autoSections: [
      "description",
      "installation",
      "usage",
      "contributing"
    ],
    debounce: 2000
  };
  
  // Write config file
  await writeFile(
    path.resolve(process.cwd(), 'readme-gen.config.json'),
    JSON.stringify(config, null, 2),
    'utf8'
  );
  
  // Create .env if API key was provided
  if (apiKey) {
    await writeFile(
      path.resolve(process.cwd(), '.env'),
      `GROQ_API_KEY=${apiKey}\n`,
      'utf8'
    );
  }
  
  console.log('✅ Configuration created successfully!');
  console.log('📘 Run "npm run gen" to generate your README');
  console.log('🔄 Run "npm start" to watch for changes and auto-update README');
}