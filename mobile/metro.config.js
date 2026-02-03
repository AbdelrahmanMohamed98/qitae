const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Extend Expo defaults: watch monorepo root so Metro sees shared and root node_modules
config.watchFolders = [...(config.watchFolders ?? []), monorepoRoot];

// Extend resolver so @qitae/shared is found in root node_modules (hoisted)
config.resolver.nodeModulesPaths = [
  ...(config.resolver.nodeModulesPaths ?? []),
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
