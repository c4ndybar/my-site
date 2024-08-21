interface HistoryItemBase {
  id: string;
  date: number;
  type: string;
}

interface SpotifyHistoryItem extends HistoryItemBase {
  type: "music";
  url: string;
  trackName: string;
  artistName: string;
}

interface GithubHistoryItem extends HistoryItemBase {
  type: "commit";
  url: string;
  message: string;
}

interface InstagramHistoryItem extends HistoryItemBase {
  type: "instaPost";
  url: string;
  caption: string;
}

interface LifeHistoryItem extends HistoryItemBase {
  type: "life";
  name: string;
  description: string;
}

interface TravelHistoryItem extends HistoryItemBase {
  type: "travel";
  name: string;
  description: string;
}

type Item =
  | SpotifyHistoryItem
  | GithubHistoryItem
  | InstagramHistoryItem
  | LifeHistoryItem
  | TravelHistoryItem;
