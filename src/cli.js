#!/usr/bin/env node
import { createWatcher } from './core/watcher.js';
import { generateREADME } from './core/generator.js';
import { initializeProject } from './init.js';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { loadConfig } from './utils/helpers.js';

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('watch', {
      type: 'boolean',
      default: false,
      description: 'Watch for changes and update README automatically'
    })
    .option('generate', {
      type: 'boolean',
      default: false,
      description: 'Generate README once'
    })
    .option('init', {
      type: 'boolean',
      default: false,
      description: 'Initialize auto-readme configuration'
    })
    .help()
    .parse();

  if (argv.init) {
    try {
      await initializeProject();
    } catch (error) {
      console.error('Error during initialization:', error.message);
      process.exit(1);
    }
  } else if (argv.watch) {
    const config = await loadConfig();
    createWatcher(config);
    console.log('Watching for changes...');
  } else if (argv.generate) {
    const config = await loadConfig();
    await generateREADME(config);
    console.log('README generated successfully!');
  } else {
    console.log('No action specified. Use --help to see available options.');
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});