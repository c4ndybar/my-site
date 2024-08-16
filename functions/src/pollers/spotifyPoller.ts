import {
  updateMusicHistory,
  getSpotifyAccessTokens,
  updateSpotifyAccessToken,
} from "../database";
import SpotifyWebApi from "spotify-web-api-node";
import { getDateFromExpiration } from "../util";

async function refreshAccessToken(spotifyApi: SpotifyWebApi): Promise<string> {
  console.log("Refreshing Spotify access token");

  const {
    body: { expires_in, access_token },
  } = await spotifyApi.refreshAccessToken();

  const expireTime = getDateFromExpiration(expires_in);

  await updateSpotifyAccessToken(access_token, expireTime);

  return access_token;
}

async function getRecentTracks(
  spotifyApi: SpotifyWebApi,
): Promise<SpotifyTrack[]> {
  const {
    body: { items },
  } = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 });

  return items.map((item) => {
    return {
      id: item.track.id,
      artistName: item.track.artists[0].name,
      trackName: item.track.name,
      trackUrl: item.track.external_urls.spotify, // deprecating
      url: item.track.external_urls.spotify,
      datePlayed: new Date(item.played_at), // deprecating
      date: new Date(item.played_at),
    };
  });
}

export async function pollSpotify() {
  let accessTokens = await getSpotifyAccessTokens();

  const spotifyApi = new SpotifyWebApi({
    clientId: accessTokens.clientId,
    clientSecret: accessTokens.clientSecret,
    accessToken: accessTokens.accessToken,
    refreshToken: accessTokens.refreshToken,
  });

  // we have to get a new token if the old one is expired
  if (accessTokens.accessTokenExpireTime < new Date()) {
    const newToken = await refreshAccessToken(spotifyApi);

    spotifyApi.setAccessToken(newToken);
  }

  const tracks = await getRecentTracks(spotifyApi);
  await updateMusicHistory(tracks);

  return tracks;
}
