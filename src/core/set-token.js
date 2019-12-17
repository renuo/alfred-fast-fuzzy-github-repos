#!/usr/bin/env node
'use strict';

const alfy = require('alfy');

const input = alfy.input;

if (input) {
  alfy.config.set('token', input);
}
