import React from 'react';
import { Link } from '@material-ui/core'
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    historyTime: {
        borderRight: "solid 1px rgba(0,0,0,0.5)",
        textAlign: 'right',
        paddingRight: '0.25rem'
    },
    historyDescription: {
        paddingLeft: '0.25rem'
    }
}));

function getItemDescription(item) {
    switch (item.type) {
        case 'music':
            return (<span>Listend to <Link href={item.url} target="_blank">{item.description}</Link></span>);
        case 'commit':
            return (<span>Commited "<Link href={item.url} target="_blank">{item.description}</Link>"</span>);
        default:
            return item.description;
    }
}

export default function HistoryItem({ item }) {
    const classes = useStyles();

    return (
        <tr>
            <td className={classes.historyTime}>{moment(item.date).fromNow()}</td><td className={classes.historyDescription}>{ getItemDescription(item)}</td>
        </tr>
    )
}