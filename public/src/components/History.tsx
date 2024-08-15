import React, { useState, useEffect } from 'react';
import HistoryItem, { Item } from './HistoryItem'
import { db } from '../database'
import { Typography, CircularProgress } from '@material-ui/core'
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
        M: "%dM",
        MM: "%dM",
        y: "%dy",
        yy: "%dy"
    }
});

function getDbHistoryItems(collectionName: string, itemType: string) : Promise<Item[]> {
    return db.collection(collectionName).orderBy('date', 'desc').limit(3).get().then((snapshot) => {
        let items: Item[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data()
            items.push(Object.assign(data, {
                id: doc.id,
                type: itemType,
                date: data.date.toDate()
            }) as Item);
        });

        return items;
    });
}

export default function History() {
    const [hasError, setErrors] = useState(false)
    const [history, setHistory] = useState<Item[]>([])

    useEffect(() => {

        const instaPosts = getDbHistoryItems("instagramHistory", "instaPost");
        const recentlyPlayedMusic = getDbHistoryItems("musicHistory", "music");
        const travelHistory = getDbHistoryItems("travelHistory", "travel");
        const lifeHistory = getDbHistoryItems("lifeHistory", "life");
        const githubHistory = getDbHistoryItems("githubHistory", "commit");

        Promise.all([recentlyPlayedMusic, travelHistory, lifeHistory, githubHistory, instaPosts]).then((values) => {
            let history = values.flat().sort((a, b) => b.date - a.date)
            setHistory(history)
        }).catch((err) => {
            console.error('error occurred', err)
            setErrors(true)
        })

    }, []);

    if (hasError) {
        return (<span></span>)
    }

    return <div>
        <Typography variant="h6">Log</Typography>
        <table>
            <tbody>
                {!history.length && <CircularProgress color='inherit' size='20px' />}
                {history.map((item) => <HistoryItem key={item.id} item={item} />)}
            </tbody>
        </table>
    </div>
}