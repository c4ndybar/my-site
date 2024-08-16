interface InstaPost {
    id: string;
    caption: string;
    mediaType: string;
    url: string;
    date: Date;
}

interface InstagramToken {
    accessToken: string;
    accessTokenExpireTime: Date;
}

interface SpotifyTrack {
    id: string;
    artistName: string;
    trackName: string;
    trackUrl: string;
    url: string;
    datePlayed: Date;
    date: Date;
}

interface SpotifyToken{
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpireTime: Date;
}

interface GithubCommit {
    id: string;
    message: string;
    url: string;
    date: Date;
}