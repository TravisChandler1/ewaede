#!/usr/bin/env node

// Module resolution override for rollup platform-specific binaries
const Module = require('module');
const originalRequire = Module.prototype.require;

// Override require to intercept rollup binary requests
Module.prototype.require = function(id) {
  // Check if this is a rollup platform-specific binary request
  if (id.includes('@rollup/rollup-')) {
    console.log(`🔄 Intercepting rollup binary request: ${id}`);
    // Return the pure JavaScript rollup instead
    return require('rollup');
  }
  
  // For all other requests, use the original require
  return originalRequire.call(this, id);
};

console.log('✅ Module resolution override installed');
console.log('🔄 All @rollup/rollup-* requests will be redirected to pure JavaScript rollup');

module.exports = Module;
