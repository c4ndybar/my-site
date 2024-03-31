const db = require('./database');
const axios = require('axios');

function flattenArray(array) {
    return [].concat.apply([], array);
}

async function getRecentCommits() {
    const response = await axios({
        method: 'get',
        url: 'https://api.github.com/users/c4ndybar/events?per_page=10',
    });

    const arrayOfCommitArrays = response.data
        .filter((event) => event.type === 'PushEvent')
        .map((event) => event.payload.commits.map((commit) => {
            return {
                id: commit.sha,
                message: commit.message,
                url: commit.url,
                date: new Date(event.created_at)
            }
        }));

    return flattenArray(arrayOfCommitArrays);
}

exports.pollGithub = async () => {
    const commits = await getRecentCommits();

    await db.updateGithubHistory(commits);

    return commits;
};