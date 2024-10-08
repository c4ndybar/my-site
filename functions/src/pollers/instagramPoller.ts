import * as db from "../database";
import axios, { AxiosResponse } from "axios";
import { getDateFromExpiration } from "../util";

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

async function refreshAccessToken(accessToken: string): Promise<string> {
  console.log("Refreshing Instagram access token");

  const { data } = await axios({
    method: "get",
    url: `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`,
  });

  const expireTime = getDateFromExpiration(data.expires_in);

  await db.updateInstagramAccessToken(data.access_token, expireTime);

  return data.access_token;
}

async function getPosts(accessToken: string): Promise<InstaPost[]> {
  interface InstaPostResponse {
    id: string;
    caption: string;
    media_type: string;
    media_url: string;
    permalink: string;
    thumbnail_url: string;
    timestamp: string;
  }

  const response: AxiosResponse<{ data: InstaPostResponse[] }> = await axios({
    method: "get",
    url: `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`,
  });

  return response.data.data.map((post) => {
    return {
      id: post.id,
      caption: post.caption || "",
      mediaType: post.media_type,
      url: post.permalink,
      date: new Date(post.timestamp),
    };
  });
}

export async function pollInstagram() {
  let { accessToken, accessTokenExpireTime } =
    await db.getInstagramAccessToken();
  // Tokens are good for 60 days
  // Refresh the toekn if it will expire in less than a week
  // Unlike the Spotify access token, we can't let this one expire.  If it expires, I have to manual get a new token from the developer console.
  const currentDate = new Date();
  const expirationThreshold = new Date(currentDate.getTime() + ONE_WEEK);

  if (accessTokenExpireTime < expirationThreshold) {
    accessToken = await refreshAccessToken(accessToken);
  }

  const posts = await getPosts(accessToken);

  await db.updateInstagramHistory(posts);

  return posts;
}
