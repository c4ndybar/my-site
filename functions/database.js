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

function convertObjDatesToTimestamps(obj) {
    Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Date) {
            obj[key] = admin.firestore.Timestamp.fromDate(obj[key]);
        }
    })
}

async function truncateRefAndInsertItems(ref, items) {
    let batch = db.batch();

    const existingDocs = await ref.listDocuments()
    existingDocs.forEach((doc) => batch.delete(doc));

    items.forEach(item => {
        convertObjDatesToTimestamps(item);

        batch.set(ref.doc(item.id), item);
    });

    return batch.commit();
}

async function updateInstagramHistory(posts) {
    const instaHistoryRef = db.collection('instagramHistory');

    return truncateRefAndInsertItems(instaHistoryRef, posts);
}

async function updateGithubHistory(commits) {
    const githubHistoryRef = db.collection('githubHistory');

    truncateRefAndInsertItems(githubHistoryRef, commits);
}

async function updateMusicHistory(tracks) {
    const musicHistoryRef = db.collection('musicHistory');

    truncateRefAndInsertItems(musicHistoryRef, tracks);
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
    updateSpotifyAccessToken,
    updateInstagramHistory,
}