import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    overflowX: 'auto',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarLink: {
    flexShrink: 0,
    marginRight: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  inline: {
    display: 'inline-flex',
  }
}));

export default function Header(props) {
  const classes = useStyles();
  const { sections } = props;

  return (
    <>
      <Toolbar component="nav" variant="dense" className={classes.toolbar}>
        {sections.map((section) => {
          const LinkIcon = section.icon;
          return (
            <Link
              color="inherit"
              noWrap
              key={section.title}
              variant="body2"
              href={section.url}
              target="_blank"
              className={classes.toolbarLink}
            >
              <LinkIcon />
            </Link>
          )
        }
        )}
      </Toolbar>
    </>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
};