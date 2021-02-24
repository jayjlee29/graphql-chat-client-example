import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { getChannels } from '../../apis/GraphqlApi'
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
}));


export default function VirtualizedList(props) {
    const classes = useStyles();

    const {signOutHandler} = props
    const [conversations, setConversations] = useState([]);
    useEffect(() => {
        //getConversations()
    },[])

    function handleChatBox(){
        alert('handleChatBox')
    }
    renderRow.propTypes = {
        index: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired,
    };
    function renderRow (args) {
        const { index, style } = args;
        
        const channel = conversations[index]
        console.log(channel)
        return (
        <ListItem button style={style} key={index}>
            <ListItemText primary={`${channel.name}`} onClick={handleChatBox} />
        </ListItem>
        );
    }

    getChannels().then((data)=>{
    console.log("complete", data);
    let newConversations = data.getChannels.map(result => {
        return {
            name: `${result.title}`,
            text: `${result.description}`,
            date: `${new Date(result.createdAt)}`,
            id: `${result.id}`
        };
    });
    setConversations([...conversations, ...newConversations])
    }).catch((error)=>{
        console.error(error)
    })

  return (
    <div className={classes.root}>
      <FixedSizeList height={400} width={300} itemSize={46} itemCount={conversations.length}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
