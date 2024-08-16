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
    const doc = await spotifyRef.get()
    const tokenData = doc.data();

    tokenData.accessTokenExpireTime = tokenData.accessTokenExpireTime.toDate();

    return tokenData;
}

async function getInstagramAccessToken() {
    const tokenData = (await db.collection('keys').doc('instagram').get()).data();

    tokenData.accessTokenExpireTime = tokenData.accessTokenExpireTime.toDate();

    return tokenData;
}

function updateSpotifyAccessToken(accessToken, expireTime) {
    return spotifyRef.set({
        accessToken,
        accessTokenExpireTime: admin.firestore.Timestamp.fromDate(expireTime),
    }, { merge: true })
}

function updateInstagramAccessToken(accessToken, expireTime) {
    return db.collection('keys').doc('instagram').set({
        accessToken,
        accessTokenExpireTime: admin.firestore.Timestamp.fromDate(expireTime),
    }, { merge: true })
}

module.exports = {
    db,
    updateGithubHistory,
    updateMusicHistory,
    getSpotifyAccessTokens,
    getInstagramAccessToken,
    updateSpotifyAccessToken,
    updateInstagramAccessToken,
    updateInstagramHistory,
}