import { useState, useEffect } from "react";
import HistoryItem from "./HistoryItem";
import { db, getDbHistoryItems } from "../database";
import {
  Typography,
  CircularProgress,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  MenuProps,
  makeStyles,
  Link,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles((_theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "30px",
    alignItems: "flex-end",
  },
  filterFormControl: { width: "200px" },
  container: { minHeight: "400px" },
}));

function paginate(array: any[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
}

const eventTypes: { id: string; value: string }[] = [
  { id: "instaPost", value: "Instagram" },
  { id: "music", value: "Spotify" },
  { id: "travel", value: "Trip" },
  { id: "life", value: "Life Event" },
  { id: "commit", value: "Git Commit" },
];

// This is needed due to a bug with Material that makes the menu jump around
const menuProps: Partial<MenuProps> = {
  variant: "menu",
};

export default function History() {
  const classes = useStyles();
  const [history, setHistory] = useState<Item[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  const [loadAll, setLoadAll] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;
  let historyItems = history.filter(
    (item) => !filter.length || filter.includes(item.type),
  );
  const pageCount = Math.ceil(historyItems.length / PAGE_SIZE);
  historyItems = loadAll
    ? paginate(historyItems, page, PAGE_SIZE)
    : historyItems;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilter(event.target.value as string[]);
  };

  useEffect(() => {
    setHistory([]);

    const limit = loadAll ? 100 : 3;
    const instaPosts = getDbHistoryItems(
      "instagramHistory",
      "instaPost",
      limit,
    );
    const recentlyPlayedMusic = getDbHistoryItems(
      "musicHistory",
      "music",
      limit,
    );
    const travelHistory = getDbHistoryItems("travelHistory", "travel", limit);
    const lifeHistory = getDbHistoryItems("lifeHistory", "life", limit);
    const githubHistory = getDbHistoryItems("githubHistory", "commit", limit);

    Promise.all([
      recentlyPlayedMusic,
      travelHistory,
      lifeHistory,
      githubHistory,
      instaPosts,
    ]).then((values) => {
      const history = values.flat().sort((a, b) => b.date - a.date);

      setHistory(history);
    });
  }, [loadAll]);

  useEffect(() => {
    setPage(1);
  }, [filter, history]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h6">Log </Typography>
        {loadAll && (
          <FormControl className={classes.filterFormControl}>
            <InputLabel id="checkbox-label">Filter</InputLabel>
            <Select
              labelId="checkbox-label"
              multiple
              value={filter}
              onChange={handleFilterChange}
              input={<Input />}
              renderValue={(selected) =>
                (selected as string[])
                  .map((id) => eventTypes.find((e) => e.id === id)!.value)
                  .join(" | ")
              }
              MenuProps={menuProps}
            >
              {eventTypes.map(({ id, value }) => (
                <MenuItem key={id} value={id}>
                  <Checkbox checked={filter.indexOf(id) > -1} />
                  <ListItemText primary={value} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      {!history.length ? (
        <CircularProgress color="inherit" size="20px" />
      ) : (
        <>
          {historyItems.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
          {loadAll ? (
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
            />
          ) : (
            <Link
              onClick={() => setLoadAll((val) => !val)}
              component="button"
              variant="button"
              color="inherit"
            >
              ... Load all
            </Link>
          )}
        </>
      )}
    </div>
  );
}
