#!/usr/bin/env node
'use strict';

const alfy = require('alfy');
const token = alfy.config.get('token');

if (!token) {
  return alfy.error(new Error(`Run "gh-token" with your Personal GitHub Token`));
}

const query = `
query MyRepos($after: String) {
  viewer { 
    repositories(
      affiliations:[OWNER, ORGANIZATION_MEMBER, COLLABORATOR],
      ownerAffiliations:[OWNER, ORGANIZATION_MEMBER, COLLABORATOR],
      first: 100,
      after: $after,
      orderBy: {field: NAME, direction: ASC}
    ) {
      totalCount
      nodes {
        nameWithOwner
        name
        id
        description
        url
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
`;

(async () => {
  const variables = {};
  const repoNodes = [];

  let pagesLeft = true;
  while(pagesLeft) {
    const json = await alfy.fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { query, variables },
    });

    if (!json.data) { return alfy.log(json.errors ? json.errors : 'Unknown GraphQL Error'); }

    const repoData = json.data.viewer.repositories;
    repoNodes.push(...repoData.nodes);
    variables.after = repoData.pageInfo.endCursor;
    pagesLeft = repoData.pageInfo.hasNextPage;
  }

  alfy.config.set('repositories', repoNodes);
  console.log(repoNodes.length);
})();
