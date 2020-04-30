import React, { useState, useEffect } from 'react';
import HistoryItem from './HistoryItem'
import { db } from './database'
import { Typography } from '@material-ui/core'
import moment from 'moment';

moment.updateLocale('en', {
    relativeTime: {
        s: "%ds",
        m: "%dm",
        mm: "%dm",
        h: "%dh",
        hh: "%dh",
        d: "%dd",
        dd: "%dd",
        M: "%dmth",
        MM: "%dmth",
        y: "%dyr",
        yy: "%dyr"
    }
});

export default function History() {
    const [hasError, setErrors] = useState(false)
    const [history, setHistory] = useState([])

    useEffect(() => {
        const recentlyPlayedMusic = db.collection("musicHistory").orderBy('datePlayed', 'desc').limit(3).get().then((snapshot) => {
            let recentPlays = [];

            snapshot.forEach((doc) => {
                const data = doc.data()
                recentPlays.push({
                    id: doc.id,
                    type: 'music',
                    url: data.trackUrl,
                    description: `${data.trackName} - ${data.artistName}`,
                    date: data.datePlayed.toDate()
                });
            });

            return recentPlays
        })

        const travelHistory = db.collection("travelHistory").orderBy('date', 'desc').limit(3).get().then((snapshot) => {
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

        const lifeHistory = db.collection("lifeHistory").orderBy('date', 'desc').limit(3).get().then((snapshot) => {
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

        const githubHistory = db.collection("githubHistory").orderBy('date', 'desc').limit(3).get().then((snapshot) => {
            let history = [];

            snapshot.forEach((doc) => {
                const data = doc.data()
                history.push({
                    type: 'commit',
                    id: doc.id,
                    description: data.message,
                    url: data.url,
                    date: data.date.toDate()
                });
            });

            return history
        })

        Promise.all([recentlyPlayedMusic, travelHistory, lifeHistory, githubHistory]).then((values) => {
            let history = values.flat().sort((a, b) => b.date - a.date)
            setHistory(history)
        }).catch((err) => {
            console.error('error occurred', err)
            setErrors(true)
        })

    }, []);

    if (hasError)
        return (<span></span>)
    else {
        return (<div>
            <Typography variant="h6">Log</Typography>
            <table>
                <tbody>
                    {history.map((item) => {
                        return (
                            <HistoryItem key={item.id} item={item} />
                        )
                    })}
                </tbody>
            </table>
        </div>)
    }
}