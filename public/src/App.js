import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.scss';
import Header from './Header';
import { GitHub, LinkedIn, Instagram, SportsEsports } from '@material-ui/icons'
import { Container, Typography, Avatar, Link, Box, Grid } from '@material-ui/core';
import me from './images/me.jpeg'

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  margin: {
    marginBottom: theme.spacing(1),
  },
  avatar: {
    width: '200px',
    height: '200px'
  }
}));

const links = [
  {
    icon: LinkedIn,
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/andrew-darr/',
    text: "See where I've worked",
  },
  {
    icon: Instagram,
    title: 'Instagram',
    url: 'https://www.instagram.com/andydarrr/',
    text: "See my photos"
  },
  {
    icon: GitHub,
    title: 'Github',
    url: 'https://github.com/c4ndybar',
    text: "See my code"
  },
  {
    icon: SportsEsports,
    title: 'Xbox Live',
    url: 'https://xboxgamertag.com/search/L337-Jesu5',
    text: 'Game with me',
  }
];

export default function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Header sections={links} />
        <main>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Grid item xs sm >
              <Typography variant="h4" component="h1">
                <span className="subtle">hey there, i'm </span><span className="emphasized">Andy Darr</span><span className="subtle">, a </span><span className="emphasized">software engineer</span><span className="subtle"> in Columbus</span></Typography>
              <Box component="div" mt={1}>
                <Typography variant="subtitle1">I build apps, travel, game, play music, think, and drink lots of coffee.</Typography>
              </Box>
              <Box component="div" mt={2}>
                {/* <Typography variant="body1"></Typography> */}
                <div>
                  <Link variant="body2" href="https://www.linkedin.com/in/andrew-darr/">Drop me a line ✌️</Link>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm >
              <Box display="flex" justifyContent="center">
                <Avatar src={me} className={classes.avatar} />
              </Box>
            </Grid>
          </Grid>
        </main>
      </Container>
    </React.Fragment>
  );
}