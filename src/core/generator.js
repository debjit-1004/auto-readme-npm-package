import Groq from "groq-sdk";
import dotenv from 'dotenv';
import { readFile, writeFile } from 'fs/promises';
import { getProjectContext } from '../utils/context.js';
import { mergeContents } from '../utils/merger.js';
import { RateLimiter } from 'limiter';

// Load environment variables but don't initialize client until needed
dotenv.config();

// Create a function that returns a client instance when needed
function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is missing. Please run autoreadme --init first or add it to your .env file.');
  }
  return new Groq();
}

const rateLimiter = new RateLimiter({
  tokensPerInterval: 25,
  interval: "minute"
});

export async function generateREADME(config) {
  await rateLimiter.removeTokens(1);
  
  const context = await getProjectContext(config);
  const template = await readFile(config.templatePath, 'utf8');
  
  const groq = getGroqClient();
  const response = await groq.chat.completions.create({
    model: config.model,
    messages: [{
      role: "user",
      content: buildPrompt(context, template)
    }]
  });

  const newContent = response.choices[0].message.content;
  const existingContent = await safeReadFile('README.md');
  
  await writeFile('README.md', mergeContents(existingContent, newContent, config));
}

function buildPrompt(context, template) {
  return `
    Generate README using this template:
    ${template}
    
    Project Context:
    ${JSON.stringify(context, null, 2)}
    
    Rules:
    - Preserve <!-- MANUAL --> sections
    - Use latest package versions
    - Keep code samples concise
  `;
}

async function safeReadFile(path) {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}