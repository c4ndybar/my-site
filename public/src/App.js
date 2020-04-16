import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header';
import {GitHub, LinkedIn, Instagram} from '@material-ui/icons'
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
            <Grid item xs={12} md={6}>
              <Typography variant="h4">Hey there, I'm Andy Darr</Typography>
              <Typography variant="body1">I build apps, travel, game, play music, and drink lots of coffee.</Typography>
              <Box component="div" mt={2}>
                <Typography variant="body1">Drop me a line</Typography>
                  <div>
                    <Link variant="body2" href="mailto:andrew.darr86@gmail.com">andrew.darr86@gmail.com</Link>
                  </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
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