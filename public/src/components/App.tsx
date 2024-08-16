import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "../App.scss";
import Header from "./Header";
import { Container, Typography, Avatar, Box, Grid } from "@material-ui/core";
import me from "../images/me.jpeg";
import History from "./History";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  margin: {
    marginBottom: theme.spacing(1),
  },
  avatar: {
    width: "200px",
    height: "200px",
    borderRadius: "1rem",
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Header />
        <main>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Grid item xs sm>
              <Typography variant="h4" component="h1">
                <span className="subtle">Hey there, I'm </span>
                <span className="emphasized">Andy Darr</span>
                <span className="subtle">, a </span>
                <span className="emphasized">software engineer</span>
                <span className="subtle"> in Tucson</span>
              </Typography>
              <Box component="div" mt={2}>
                <Typography component="p" variant="body1">
                  Desert dweller. Lover of code, travel, games, and music.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm>
              <Box display="flex" justifyContent="center">
                <Avatar src={me} className={classes.avatar} variant="rounded" alt="Picture of me, Andy Darr"/>
              </Box>
            </Grid>
            <Grid item sm={12}>
              <History />
            </Grid>
          </Grid>
        </main>
      </Container>
    </>
  );
}
