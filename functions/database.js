const admin = require('firebase-admin');
const config = require('config');


if (config.googleServiceAccountKey) {
    console.log('trying google account creds')
    admin.initializeApp({
        credential: admin.credential.cert(config.googleServiceAccountKey)
    });
} else {
    console.log('no google creds provided, using default creds')
    admin.initializeApp();
}

const db = admin.firestore();
const spotifyRef = db.collection('keys').doc('spotify');

async function updateGithubHistory(commits) {
    const githubHistoryRef = db.collection('githubHistory');

    let batch = db.batch();

    const docs = await githubHistoryRef.listDocuments()
    docs.forEach((doc) => batch.delete(doc));

    commits.forEach(commit => {
        commit.date = admin.firestore.Timestamp.fromDate(commit.date);

        batch.set(githubHistoryRef.doc(commit.id), commit);
    });

    return batch.commit();
}

async function getSpotifyAccessTokens() {
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

async function updateMusicHistory(tracks) {
    const musicHistoryRef = db.collection('musicHistory');
    let batch = db.batch();

    const docs = await musicHistoryRef.listDocuments()
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

function updateSpotifyAccessToken(token, expireTime) {
    return spotifyRef.set({
        accessToken: token,
        accessTokenExpireTime: admin.firestore.Timestamp.fromDate(expireTime),
    }, { merge: true })
}

module.exports = {
    db,
    updateGithubHistory,
    updateMusicHistory,
    getSpotifyAccessTokens,
    updateSpotifyAccessToken
}