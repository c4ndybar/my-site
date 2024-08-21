import { Link } from "@material-ui/core";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import HeadphonesIcon from "@material-ui/icons/HeadsetOutlined";
import CodeIcon from "@material-ui/icons/CodeOutlined";
import CameraIcon from "@material-ui/icons/PhotoCameraOutlined";
import FlightIcon from "@material-ui/icons/FlightOutlined";
import PersonIcon from "@material-ui/icons/PersonOutline";

const useStyles = makeStyles((theme) => ({
  historyTime: {
    borderRight: "solid 1px rgba(0,0,0,0.5)",
    textAlign: "right",
    paddingRight: "0.25rem",
    minWidth: "65px",
  },
  descriptionDiv: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: "0px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    "& svg": {
      height: "15px",
      width: "15px",
    },
  },
  historyRow: {
    display: "flex",
    flexDirection: "row",
    gap: "0.25rem",
    marginTop: "3px",
  },
}));

interface HistoryItemProps {
  item: Item;
}

export default function HistoryItem({ item }: HistoryItemProps) {
  const classes = useStyles();

  function getItemDescription(item: Item) {
    switch (item.type) {
      case "music":
        return (
          <div className={classes.descriptionDiv}>
            <HeadphonesIcon /> Listend to{" "}
            <Link href={item.url} target="_blank">
              {item.trackName + " - " + item.artistName}
            </Link>
          </div>
        );
      case "commit":
        return (
          <div className={classes.descriptionDiv}>
            <CodeIcon /> Commited code
            <Link href={item.url} target="_blank">
              "{item.message}"
            </Link>
          </div>
        );
      case "instaPost":
        return (
          <div className={classes.descriptionDiv}>
            <CameraIcon /> Posted picture
            <Link href={item.url} target="_blank">
              "{item.caption || "on Instagram"}"
            </Link>
          </div>
        );
      case "travel":
        return (
          <div className={classes.descriptionDiv}>
            <FlightIcon /> {item.name || item.description}
          </div>
        );
      case "life":
        return (
          <div className={classes.descriptionDiv}>
            <PersonIcon /> {item.name || item.description}
          </div>
        );
      default:
        console.error(`Unknown item type: ${JSON.stringify(item)}`);
    }
  }

  return (
    <div className={classes.historyRow}>
      <div className={classes.historyTime}>{moment(item.date).fromNow()}</div>
      {getItemDescription(item)}
    </div>
  );
}
