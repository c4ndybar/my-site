import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/App";
import moment from "moment";

moment.updateLocale("en", {
  relativeTime: {
    s: "%ds",
    m: "%dm",
    mm: "%dm",
    h: "%dh",
    hh: "%dh",
    d: "%dd",
    dd: "%dd",
    M: "%dM",
    MM: "%dM",
    y: "%dy",
    yy: "%dy",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
