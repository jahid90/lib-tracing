#!/usr/bin/env node

console.info = () => {}
console.debug = () => {}

const updateVersion = require('../src/update-version');
updateVersion();
