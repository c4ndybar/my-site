const functions = require('firebase-functions');
const {fn} = require('./spotifyPoller')

exports.spotifyPoller = functions.https.onRequest(async (request, response) => {
    try {
        const result = await fn()
        console.log('result is ', result)
        response.json(result);
    } catch (err) {
        console.error(err)
        response.status('500').json(err)
    }
});
