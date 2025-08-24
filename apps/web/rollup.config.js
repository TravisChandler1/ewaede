// Force pure JavaScript rollup configuration
export default {
  // Force pure JavaScript mode
  onwarn(warning, warn) {
    // Suppress all rollup warnings about missing optional dependencies
    if (warning.code === 'MODULE_NOT_FOUND' && warning.message.includes('@rollup/rollup-')) {
      return;
    }
    if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('@rollup/rollup-')) {
      return;
    }
    warn(warning);
  },
  
  // Force pure JavaScript rollup
  external: [
    '@rollup/rollup-linux-x64-gnu',
    '@rollup/rollup-darwin-x64',
    '@rollup/rollup-win32-x64-msvc'
  ],
  
  // Environment variables to force pure JavaScript
  env: {
    ROLLUP_NATIVE: 'false',
    ROLLUP_PLATFORM: 'linux',
    ROLLUP_ARCH: 'x64'
  }
};
