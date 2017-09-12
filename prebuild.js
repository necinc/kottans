const fs = require('fs');

const githubToken = process.env.GITHUB_TOKEN;

if (githubToken === undefined) {
  console.log('GITHUB_TOKEN has to be provided as env variable');
  process.exit(1);
} 

const tokenHalf = Math.floor(githubToken.length / 2);
const firstTokenPart = githubToken.slice(0, tokenHalf);
const secondTokenPart = githubToken.slice(tokenHalf);

const content = `module.exports = {
  github_token: {
    firstPart: "${firstTokenPart}",
    secondPart: "${secondTokenPart}"
  },
}
`;

const res = fs.writeFileSync('./src/config.js', content);

process.exit(0);
