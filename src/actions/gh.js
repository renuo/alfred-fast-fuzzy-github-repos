#!/usr/bin/env node
'use strict';

const alfy = require('alfy');
const token = alfy.config.get('token');

if (!token) {
  return alfy.error(new Error(`Run "gh-token" first for setup`));
}

const repoNodes = alfy.config.get('repositories');
if (!repoNodes) {
  return alfy.error(new Error(`Run "gh-sync" first to populate your repo list`));
}

function fuzzyMatch(pattern, str) {
  pattern = '.*' + pattern.split('').join('.*') + '.*';
  const re = new RegExp(pattern);
  return re.test(str);
}

const results = alfy
  .inputMatches(repoNodes, (item, input) => {
    return fuzzyMatch(input, item.nameWithOwner);
  })
  .sort((nodeA, nodeB) => nodeA.nameWithOwner.length - nodeB.nameWithOwner.length)
  .map((node) => {
    return {
      title: node.nameWithOwner,
      subtitle: node.description || '',
      arg: node.url
    };
  });

alfy.output(results);
