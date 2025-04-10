import chokidar from 'chokidar';
import { generateREADME } from './generator.js';
import debounce from 'lodash.debounce';

export function createWatcher(config) {
  const watcher = chokidar.watch(config.watchPaths, {
    ignored: config.ignorePatterns,
    ignoreInitial: true
  });

  const debouncedGenerate = debounce(
    () => generateREADME(config),
    config.debounce || 2000
  );

  watcher
    .on('add', debouncedGenerate)
    .on('change', debouncedGenerate)
    .on('unlink', debouncedGenerate);

  return watcher;
}