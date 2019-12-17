#!/usr/bin/env node
'use strict';

const alfy = require('alfy');
const input = alfy.input;
const token = alfy.config.get('token');

if (!token) {
  return alfy.error(new Error(`Run "gh-token" first for setup`));
}

alfy.output([
  {
    title: `Download the list of my Github repos`,
    arg: input
  }
]);
