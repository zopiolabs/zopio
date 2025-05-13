const { Octokit } = require("@octokit/rest");
const fs = require("fs");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function generate() {
  const { data: releases } = await octokit.repos.listReleases({
    owner: "zopiolabs",
    repo: "zopio",
  });

  const latest = releases[0];

  const logspotData = {
    entries: [
      {
        title: latest.name || latest.tag_name,
        date: latest.published_at,
        content: latest.body,
      },
    ],
  };

  fs.writeFileSync(
    "apps/whatsnew/public/whatsnew.json",
    JSON.stringify(logspotData, null, 2)
  );
}

generate();
