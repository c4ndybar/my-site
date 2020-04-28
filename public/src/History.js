import React, { useState, useEffect } from 'react';
import { db } from './database'
import { Typography, Link } from '@material-ui/core'
import moment from 'moment';

export default function History() {
    const [hasError, setErrors] = useState(false)
    const [history, setHistory] = useState([])

    useEffect(() => {
        db.collection("musicHistory").get().then((querySnapshot) => {
            let history = [];
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                history.push({ ...doc.data(), id: doc.id });
            });

            setHistory(history);
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
                            {moment(item.datePlayed.toDate()).fromNow()} | <Link href={item.trackUrl} target="_blank">{item.trackName} - {item.artistName}</Link>
                        </li>
                    )

                })}
            </ul>
        </div>)
    }
}