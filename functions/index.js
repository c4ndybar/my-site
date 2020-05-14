const functions = require('firebase-functions');
const { pollSpotify } = require('./spotifyPoller')
const { pollGithub } = require('./githubPoller')
const { pollInstagram } = require('./instagramPoller')

function createHttpsListener(fn) {
    return functions.https.onRequest(async (request, response) => {
        try {
            const result = await fn()
            console.log('result is ', result)
            response.json(result);
        } catch (err) {
            console.error(err)
            response.status('500').json(err)
        }
    });
}

exports.pollSpotify = createHttpsListener(pollSpotify);
exports.pollGithub = createHttpsListener(pollGithub);
exports.pollInstagram = createHttpsListener(pollInstagram);

exports.apiPoller = functions.pubsub.schedule('0 9-23 * * *').onRun(() => {
    return Promise.all([pollSpotify(), pollGithub(), pollInstagram()])
        .then(() => console.log('api polling successful'))
        .catch((err) => console.error('error polling apis', err))
});