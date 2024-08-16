import admin from "firebase-admin";
import config from "config";

const googleCreds = config.get("googleServiceAccountKey");

if (googleCreds) {
  console.log("trying google account creds");
  admin.initializeApp({
    credential: admin.credential.cert(googleCreds),
  });
} else {
  console.log("no google creds provided, using default creds");
  admin.initializeApp();
}

const db = admin.firestore();
const spotifyRef = db.collection("keys").doc("spotify");

function convertObjDatesToTimestamps(obj: any) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Date) {
      obj[key] = admin.firestore.Timestamp.fromDate(obj[key]);
    }
  });
}

async function truncateRefAndInsertItems(
  ref: FirebaseFirestore.CollectionReference,
  items: any[],
) {
  let batch = db.batch();

  const existingDocs = await ref.listDocuments();
  existingDocs.forEach((doc) => batch.delete(doc));

  items.forEach((item) => {
    convertObjDatesToTimestamps(item);

    batch.set(ref.doc(item.id), item);
  });

  return batch.commit();
}

async function updateInstagramHistory(posts: InstaPost[]) {
  const instaHistoryRef = db.collection("instagramHistory");

  return truncateRefAndInsertItems(instaHistoryRef, posts);
}

async function updateGithubHistory(commits: GithubCommit[]) {
  const githubHistoryRef = db.collection("githubHistory");

  truncateRefAndInsertItems(githubHistoryRef, commits);
}

async function updateMusicHistory(tracks: SpotifyTrack[]) {
  const musicHistoryRef = db.collection("musicHistory");

  truncateRefAndInsertItems(musicHistoryRef, tracks);
}
async function getSpotifyAccessTokens(): Promise<SpotifyToken> {
  const doc = await spotifyRef.get();
  const tokenData: any = doc.data();

  tokenData.accessTokenExpireTime = tokenData.accessTokenExpireTime.toDate();

  return tokenData;
}

async function getInstagramAccessToken(): Promise<InstagramToken> {
  const tokenData: any = (
    await db.collection("keys").doc("instagram").get()
  ).data();

  tokenData.accessTokenExpireTime = tokenData.accessTokenExpireTime.toDate();

  return tokenData as InstagramToken;
}

function updateSpotifyAccessToken(accessToken: string, expireTime: Date) {
  return spotifyRef.set(
    {
      accessToken,
      accessTokenExpireTime: admin.firestore.Timestamp.fromDate(expireTime),
    },
    { merge: true },
  );
}

function updateInstagramAccessToken(accessToken: string, expireTime: Date) {
  return db
    .collection("keys")
    .doc("instagram")
    .set(
      {
        accessToken,
        accessTokenExpireTime: admin.firestore.Timestamp.fromDate(expireTime),
      },
      { merge: true },
    );
}

export {
  db,
  updateGithubHistory,
  updateMusicHistory,
  getSpotifyAccessTokens,
  getInstagramAccessToken,
  updateSpotifyAccessToken,
  updateInstagramAccessToken,
  updateInstagramHistory,
};
