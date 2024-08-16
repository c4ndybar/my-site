const { updateMusicHistory, getSpotifyAccessTokens, updateSpotifyAccessToken } = require('./database');
const SpotifyWebApi = require('spotify-web-api-node');
const { getDateFromExpiration } = require('./util');

async function refreshAccessToken(spotifyApi) {
    console.log('Refreshing Spotify access token');

    const { body } = await spotifyApi.refreshAccessToken()

    const expireTime = getDateFromExpiration(body['expires_in']);

    await updateSpotifyAccessToken(body['access_token'], expireTime)

    return body['access_token'];
}

async function getRecentTracks(spotifyApi) {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 })

    return data.body.items.map((item) => {
        return {
            id: item.track.id,
            artistName: item.track.artists[0].name,
            trackName: item.track.name,
            trackUrl: item.track.external_urls.spotify, // deprecating
            url: item.track.external_urls.spotify,
            datePlayed: new Date(item.played_at), // deprecating
            date: new Date(item.played_at)
        }
    })

}

exports.pollSpotify = async () => {
    let accessTokens = await getSpotifyAccessTokens();

    const spotifyApi = new SpotifyWebApi({
        clientId: accessTokens.clientId,
        clientSecret: accessTokens.clientSecret,
        accessToken: accessTokens.accessToken,
        refreshToken: accessTokens.refreshToken
    });

    // we have to get a new token if the old one is expired
    if (accessTokens.accessTokenExpireTime < (new Date())) {
        const newToken = await refreshAccessToken(spotifyApi);

        spotifyApi.setAccessToken(newToken);
    }

    const tracks = await getRecentTracks(spotifyApi);
    await updateMusicHistory(tracks);

    return tracks;
};