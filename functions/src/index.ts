import { https, pubsub } from "firebase-functions";
import { pollSpotify } from "./pollers/spotifyPoller";
import { pollGithub } from "./pollers/githubPoller";
import { pollInstagram } from "./pollers/instagramPoller";

function createHttpsListener(fn: () => Promise<any>) {
  return https.onRequest(async (_request, response) => {
    try {
      const result = await fn();
      console.log("result is ", result);
      response.json(result);
    } catch (err) {
      console.error(err);
      response.status(500).json(err);
    }
  });
}

exports.pollSpotify = createHttpsListener(pollSpotify);
exports.pollGithub = createHttpsListener(pollGithub);
exports.pollInstagram = createHttpsListener(pollInstagram);

exports.apiPoller = pubsub.schedule("0 9-23 * * *").onRun(() => {
  return Promise.all([pollSpotify(), pollGithub(), pollInstagram()])
    .then(() => console.log("api polling successful"))
    .catch((err) => console.error("error polling apis", err));
});
