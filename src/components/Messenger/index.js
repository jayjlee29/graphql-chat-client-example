'use strict'
import React, { useState, useEffect } from 'react';

import { Route, Router } from 'react-router-dom';

import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import ChannelList from '../ChannelList'
import './Messenger.css';

export default function Messenger(props) {
	const {signOutHandler, sessionInfo} = props
    const [channelId, setChannelId] = useState(null);

	useEffect(()=>{
		console.log('selected channelId', channelId)
	}, [channelId])

	const selectChannel = (channel) => {
        if(channel && channel.id){
            setChannelId(channel.id) 
        }
		
	}

    return (
      <div>
          <Route exact path="/" render={(props)=><ConversationList {...props} signOutHandler={signOutHandler} sessionInfo={sessionInfo} selectChannel={selectChannel} />}/> 
          <Route exact path="/channel" render={(props)=><ChannelList {...props} sessionInfo={sessionInfo} channelId={channelId} />} />
          <Route path="/channel/:channelId" render={(props)=> <MessageList {...props} sessionInfo={sessionInfo} channelId={channelId} />} />
      </div>


    );
}