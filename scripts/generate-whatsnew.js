const { Octokit } = require("@octokit/rest");
const fs = require("node:fs");

// Define a simple logger to avoid direct console usage
const logger = {
  info: (message) => {
    // eslint-disable-next-line no-console
    console.log(message);
  },
  error: (message, error) => {
    // eslint-disable-next-line no-console
    console.error(message, error);
  }
};

// Define regex patterns at the top level for better performance
const versionPrefixRegex = /^v/;

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Parse GitHub release body to extract changes by type
 * @param {string} body - Release body content
 * @returns {Array} - Parsed changes array
 */
function parseReleaseBody(body) {
  if (!body) {
    return [];
  }
  
  // Default changes if we can't parse the body
  const defaultChanges = [
    {
      type: "improvement",
      description: "Various improvements and bug fixes"
    }
  ];

  try {
    // Try to parse markdown content to extract changes
    // This is a simple parser that looks for bullet points with specific prefixes
    const lines = body.split('\n');
    const changes = [];
    
    const typeMap = {
      'feature:': 'feature',
      'feat:': 'feature',
      'fix:': 'fix',
      'bugfix:': 'fix',
      'improvement:': 'improvement',
      'improve:': 'improvement',
      'breaking:': 'breaking',
      'breaking change:': 'breaking'
    };
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const content = trimmedLine.substring(2).trim();
        
        // Try to determine the type from the content
        let type = 'improvement'; // Default type
        let description = content;
        
        for (const [prefix, changeType] of Object.entries(typeMap)) {
          if (content.toLowerCase().startsWith(prefix)) {
            type = changeType;
            description = content.substring(prefix.length).trim();
            break;
          }
        }
        
        changes.push({
          type,
          description
        });
      }
    }
    
    return changes.length > 0 ? changes : defaultChanges;
  } catch (error) {
    logger.error('Error parsing release body:', error);
    return defaultChanges;
  }
}

/**
 * Format date to a readable format (e.g., "May 14, 2025")
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function generate() {
  try {
    const { data: releases } = await octokit.repos.listReleases({
      owner: "zopiolabs",
      repo: "zopio",
    });

    if (!releases || releases.length === 0) {
      logger.info('No releases found. Creating default whatsnew.json');
      const defaultData = {
        items: []
      };
      fs.writeFileSync(
        "apps/whatsnew/public/whatsnew.json",
        JSON.stringify(defaultData, null, 2)
      );
      return;
    }

    // Get the latest release
    const latest = releases[0];
    
    // Parse the release body to extract changes
    const changes = parseReleaseBody(latest.body);
    
    // Format the date
    const formattedDate = formatDate(latest.published_at);
    
    // Create the whatsnew data structure
    const whatsnewData = {
      items: [
        {
          version: latest.tag_name.replace(versionPrefixRegex, ''), // Remove 'v' prefix if present
          date: formattedDate,
          changes: changes
        }
      ]
    };

    // Write the data to the whatsnew.json file
    fs.writeFileSync(
      "apps/whatsnew/public/whatsnew.json",
      JSON.stringify(whatsnewData, null, 2)
    );
    
    logger.info(`Successfully generated whatsnew.json for version ${latest.tag_name}`);
  } catch (error) {
    logger.error('Error generating whatsnew.json:', error);
    process.exit(1);
  }
}

generate();
