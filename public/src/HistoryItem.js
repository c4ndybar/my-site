import React from 'react';
import { Link } from '@material-ui/core'
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    historyTime: {
        display: 'inline-block',
        width: '60px',
        textAlign: 'right',
    },
}));

function getItemDescription(item) {
    let prefix = '';

    switch (item.type) {
        case 'music':
            prefix = 'listened to ';
            break;
        case 'commit':
            prefix = 'commited ';
    }

    if (item.url) {
        return (<span>{prefix} <Link href={item.url} target="_blank">{item.description}</Link></span>)
    } else {
        return prefix + item.description;
    }
}

export default function HistoryItem({ item }) {
    const classes = useStyles();

    return (
        <span>
            <span className={classes.historyTime}> {moment(item.date).fromNow()} </span> : { getItemDescription(item)}
        </span>
    )
}