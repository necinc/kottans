const fs = require('fs');

const githubToken = process.env.GITHUB_TOKEN;

if (githubToken === undefined) {
  console.log('GITHUB_TOKEN has to be provided as env variable');
  process.exit(1);
} 

const content = `module.exports = {
  github_token: "${githubToken}"
}
`;

const res = fs.writeFileSync('./src/config.js', content);

process.exit(0);
