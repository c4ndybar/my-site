const admin = require('firebase-admin');
const SpotifyWebApi = require('spotify-web-api-node');
const config = require('config');

if (config.googleServiceAccountKey) {
    console.log('trying account creds')
    admin.initializeApp({
        credential: admin.credential.cert(config.googleServiceAccountKey)
    });
} else {
    console.log('no creds provided, using default creds')
    admin.initializeApp();
}

const db = admin.firestore();
const spotifyRef = db.collection('keys').doc('spotify');
const musicHistoryRef = db.collection('musicHistory');

async function getAccessTokens() {
    return spotifyRef.get()
        .then((doc) => {
            console.log(doc.id, '=>', doc.data());
            let result = doc.data();
            result.accessTokenExpireTime = result.accessTokenExpireTime.toDate();
            return result;
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
}

async function refreshAccessToken(spotifyApi) {
    const { body } = await spotifyApi.refreshAccessToken()
    console.log('The access token has been refreshed!', body);

    spotifyApi.setAccessToken(body['access_token']);

    let expireTime = admin.firestore.Timestamp.fromMillis(Date.now() + Number.parseInt(body['expires_in'] * 1000));

    return spotifyRef.set({
        accessToken: body['access_token'],
        accessTokenExpireTime: expireTime,
    }, { merge: true })
}

async function getRecentTracks(spotifyApi) {
    const data = await spotifyApi.getMyRecentlyPlayedTracks()
    console.log("Got back recent track data", data);
    return data.body.items.map((item) => {
        return {
            id: item.track.id,
            artistName: item.track.artists[0].name,
            trackName: item.track.name,
            trackUrl: item.track.external_urls.spotify,
            datePlayed: new Date(item.played_at)
        }
    })

}

async function updateMusicHistoryDb(tracks) {
    let batch = db.batch();

    const docs = await musicHistoryRef.listDocuments()
    console.debug('got docs', docs.length);
    docs.forEach((doc) => batch.delete(doc));

    tracks.sort((l, r) => l.datePlayed < r.datePlayed)
        .forEach(track => {
            const id = track.id;
            delete track.id;
            track.datePlayed = admin.firestore.Timestamp.fromDate(track.datePlayed);

            batch.set(musicHistoryRef.doc(id), track);
        });

    return batch.commit();
}
exports.fn = async () => {
    let accessTokens = await getAccessTokens();

    const spotifyApi = new SpotifyWebApi({
        clientId: accessTokens.clientId,
        clientSecret: accessTokens.clientSecret,
        accessToken: accessTokens.accessToken,
        refreshToken: accessTokens.refreshToken
    });

    if (accessTokens.accessTokenExpireTime < (new Date())) {
        console.log('refreshing token');
        await refreshAccessToken(spotifyApi);
    }

    const tracks = await getRecentTracks(spotifyApi);
    await updateMusicHistoryDb(tracks);

    return tracks;
};