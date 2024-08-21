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

interface GenericHistoryItem extends HistoryItemBase {
  type: "generic";
  name: string;
  description: string;
}

type Item =
  | SpotifyHistoryItem
  | GithubHistoryItem
  | InstagramHistoryItem
  | GenericHistoryItem;
