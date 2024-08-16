import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import { GitHub, LinkedIn, Instagram, SportsEsports } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  linkContainer: {
    overflowX: "auto",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  link: {
    flexShrink: 0,
    marginRight: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  inline: {
    display: "inline-flex",
  },
}));

const links = [
  {
    icon: LinkedIn,
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/andrew-darr/",
    text: "See where I've worked",
  },
  {
    icon: Instagram,
    title: "Instagram",
    url: "https://www.instagram.com/andydarrr/",
    text: "See my photos",
  },
  {
    icon: GitHub,
    title: "Github",
    url: "https://github.com/c4ndybar",
    text: "See my code",
  },
  {
    icon: SportsEsports,
    title: "Xbox Live",
    url: "https://xboxgamertag.com/search/L337-Jesu5",
    text: "Game with me",
  },
];

export default function Header() {
  const classes = useStyles();

  return (
    <>
      <Toolbar
        component="nav"
        variant="dense"
        className={classes.linkContainer}
      >
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              color="inherit"
              noWrap
              key={link.title}
              variant="body2"
              href={link.url}
              target="_blank"
              className={classes.link}
              aria-label={link.title}
            >
              <LinkIcon />
            </Link>
          );
        })}
      </Toolbar>
    </>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
};
