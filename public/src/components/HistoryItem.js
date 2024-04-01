import React from 'react';
import { Link } from '@material-ui/core'
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    historyTime: {
        borderRight: "solid 1px rgba(0,0,0,0.5)",
        textAlign: 'right',
        paddingRight: '0.25rem',
        minWidth: '65px',
    },
    historyDescription: {
        paddingLeft: '0.25rem'
    },
    descriptionDiv: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '300px',
    }
}));

function getItemDescription(item, className) {
    switch (item.type) {
        case 'music':
            return (<div className={className}>Listend to <Link href={item.url} target="_blank">{item.trackName + ' - ' + item.artistName}</Link></div>);
        case 'commit':
            return (<div className={className}>Commited code "<Link href={item.url} target="_blank">{item.message}</Link>"</div>);
        case 'instaPost':
            if (item.caption) {
                return (<div className={className}>Posted picture "<Link href={item.url} target="_blank">{item.caption}</Link>"</div>);
            }

            return (<div className={className}>Posted <Link href={item.url} target="_blank">picture</Link></div>);
        default:
            return (<div className={className}>{item.name || item.description}</div>)
    }
}

export default function HistoryItem({ item }) {
    const classes = useStyles();

    return <tr>
        <td className={classes.historyTime}>{moment(item.date).fromNow()}</td><td className={classes.historyDescription}>{getItemDescription(item, classes.descriptionDiv)}</td>
    </tr>
}