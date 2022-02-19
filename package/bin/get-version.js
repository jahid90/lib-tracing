#!/usr/bin/env node

console.debug = () => {}
console.info = () => {}

const getVersion = require('../src/get-version');
console.log(getVersion());
