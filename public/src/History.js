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
        const recentlyPlayedMusic = db.collection("musicHistory").orderBy('datePlayed', 'desc').limit(5).get().then((snapshot) => {
            let recentPlays = [];

            snapshot.forEach((doc) => {
                const data = doc.data()
                recentPlays.push({
                    id: doc.id,
                    url: data.trackUrl,
                    description: `${data.trackName} - ${data.artistName}`,
                    date: data.datePlayed.toDate()
                });
            });

            return recentPlays
        })

        const travelHistory = db.collection("travelHistory").orderBy('date', 'desc').limit(5).get().then((snapshot) => {
            let travelHistory = [];

            snapshot.forEach((doc) => {
                const data = doc.data()
                travelHistory.push({
                    id: doc.id,
                    description: data.name,
                    date: data.date.toDate()
                });
            });

            return travelHistory
        })

        const lifeHistory = db.collection("lifeHistory").orderBy('date', 'desc').limit(5).get().then((snapshot) => {
            let history = [];

            snapshot.forEach((doc) => {
                const data = doc.data()
                history.push({
                    id: doc.id,
                    description: data.name,
                    date: data.date.toDate()
                });
            });

            return history
        })

        Promise.all([recentlyPlayedMusic, travelHistory, lifeHistory]).then((values) => {
            let history = values.flat().sort((a, b) => b.date - a.date)
            setHistory(history)
        }).catch((err) => {
            console.error('error occurred', err)
            setErrors(true)
        })

}, []);

function getHistoryLine(item) {
    if (item.url) {
        return <Link href={item.url} target="_blank">{item.description}</Link>
    } else {
        return item.description
    }
}
if (hasError)
    return (<h3>ERROR</h3>)
else {
    return (<div>
        <Typography variant="h6">Recent Plays</Typography>
        <ul>
            {history.map((item) => {
                return (
                    <li key={item.id}>
                         <span className={classes.historyTime}>{moment(item.date).fromNow()}</span> | {getHistoryLine(item)}
                    </li>
                )

            })}
        </ul>
    </div>)
}
}