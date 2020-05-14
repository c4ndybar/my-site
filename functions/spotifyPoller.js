const {updateMusicHistory, getSpotifyAccessTokens, updateSpotifyAccessToken} = require('./database');
const SpotifyWebApi = require('spotify-web-api-node');

async function refreshAccessToken(spotifyApi) {
    const { body } = await spotifyApi.refreshAccessToken()
    console.log('The access token has been refreshed!');

    spotifyApi.setAccessToken(body['access_token']);
    let expireTime = new Date(Date.now() + Number.parseInt(body['expires_in'] * 1000));

     return updateSpotifyAccessToken(body['access_token'], expireTime)
}

async function getRecentTracks(spotifyApi) {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({limit: 10})

    return data.body.items.map((item) => {
        return {
            id: item.track.id,
            artistName: item.track.artists[0].name,
            trackName: item.track.name,
            trackUrl: item.track.external_urls.spotify, // deprecating
            url: item.track.external_urls.spotify,
            datePlayed: new Date(item.played_at) // deprecating
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

    if (accessTokens.accessTokenExpireTime < (new Date())) {
        console.log('refreshing token');
        await refreshAccessToken(spotifyApi);
    }

    const tracks = await getRecentTracks(spotifyApi);
    await updateMusicHistory(tracks);

    return tracks;
};