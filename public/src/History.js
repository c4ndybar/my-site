import React, { useState, useEffect } from 'react';
import { db } from './database'
import { Typography, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    historyTime: {
        display: 'inline-block',
        width: '60px',
        textAlign: 'right',
    },
}));

moment.updateLocale('en', {
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
        yy: "%dy"
    }
});

export default function History() {
    const [hasError, setErrors] = useState(false)
    const [history, setHistory] = useState([])
    const classes = useStyles();

    useEffect(() => {
        db.collection("musicHistory").get().then((querySnapshot) => {
            let history = [];
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                history.push({ ...doc.data(), id: doc.id });
            });

            setHistory(history.sort((a, b) => b.datePlayed.seconds - a.datePlayed.seconds));
        }).catch((err) => {
            console.error(err);
            setErrors(true);
        });
    }, []);

    if (hasError)
        return (<h3>ERROR</h3>)
    else {
        return (<div>
            <Typography variant="h6">Recent Plays</Typography>
            <ul>
                {history.map((item) => {
                    return (
                        <li key={item.id}>
                            <span className={classes.historyTime}>{moment(item.datePlayed.toDate()).fromNow()}</span> | <Link href={item.trackUrl} target="_blank">{item.trackName} - {item.artistName}</Link>
                        </li>
                    )

                })}
            </ul>
        </div>)
    }
}