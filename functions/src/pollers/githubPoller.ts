import { AxiosResponse } from "axios";
import * as db from "../database";
import axios from "axios";

function flattenArray(array: any[]) {
  return [].concat.apply([], array);
}

// This type only covers Push Events and the fields we care about. It should be updated if we want to use more.
interface GithubEvent {
  type: string;
  payload: {
    commits: {
      sha: string;
      message: string;
      url: string;
    }[];
  };
  created_at: string;
}

async function getRecentCommits(): Promise<GithubCommit[]> {
  const response: AxiosResponse<GithubEvent[]> = await axios({
    method: "get",
    url: "https://api.github.com/users/c4ndybar/events?per_page=10",
  });

  const arrayOfCommitArrays = response.data
    .filter((event) => event.type === "PushEvent")
    .map((event) =>
      event.payload.commits.map((commit) => {
        return {
          id: commit.sha,
          message: commit.message,
          url: commit.url,
          date: new Date(event.created_at),
        };
      }),
    );

  return flattenArray(arrayOfCommitArrays);
}

export async function pollGithub() {
  const commits = await getRecentCommits();

  await db.updateGithubHistory(commits);

  return commits;
}
