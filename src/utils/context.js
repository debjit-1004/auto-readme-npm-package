import { readFile } from 'fs/promises';
import { globby } from 'globby';

export async function getProjectContext(config) {
  const pkg = JSON.parse(await readFile('package.json'));
  
  return {
    name: pkg.name,
    version: pkg.version,
    dependencies: Object.keys(pkg.dependencies || {}),
    devDependencies: Object.keys(pkg.devDependencies || {}),
    scripts: pkg.scripts || {},
    files: await getFileStructure(config),
    exports: await analyzeExports()
  };
}

async function getFileStructure(config) {
  return globby(config.watchPaths, {
    ignore: config.ignorePatterns,
    onlyFiles: true
  });
}

async function analyzeExports() {
  // Simplified export analysis
  const files = await globby(['src/**/*.js']);
  return files.flatMap(file => ({
    file,
    exports: ['default'] // Placeholder
  }));
}