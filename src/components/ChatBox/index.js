'use strict'
import React, {useEffect, useState, useRef} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';

import { gql, useQuery, useSubscription } from '@apollo/client';

import './MessageList.css';
import {getChannelMessages} from '../../apis/GraphqlApi'

const SUBSCRIPTION_CHANNEL = gql`
  subscription onSubscriptionMessage($channelId: String!) {
    channel(channelId: $channelId){
      channel {
        id
        title
        description
      }
      message{
        id
		payload
		userId
		createdAt
      }
      createdAt
    }
  }
`



export default function ChatBox(props) {
    const {sessionInfo } = props
	const messageRef = useRef();
	const [list, setList] = useState([])
	const { channelId } = props
	//console.log('MessageList sessionInfo', JSON.stringify(sessionInfo))
	useEffect(()=>{
		scrollToBottom()
	}, []);

    getChannelMessages(channelId).then((data)=>{
		console.log("get channel messages", data);
		const messageList = removeDuplicatedObject([...data.getChannelMessages])
		setList(messageList.map((current, idx, messages)=>{
            const data = {
				id: current.id,
				author: current.userId,
				message: current.payload,
				timestamp: new Date(current.createdAt).getTime()
			}

			const previous = messages[idx-1]
			const next = messages[idx+1]

			console.log(current, previous)
			const diff = new Date(current.createdAt).getTime() - previous?new Date(previous.createdAt).getTime():0;
			
			
			const isMine = sessionInfo.user.userId === current.userId?true:false
			const startsSequence = previous?false:true
			const endsSequence  = next?false:true
			const showTimestamp = diff>(1000*60*1)?true:false//endsSequence?true:false


            return {
                id: it.id,
                message: current.payload,
                end: next? true:false
            }
        }))
	}).catch((err)=>{
		console.error(err)
	})

	return(
		<div >
			<ChatBot steps={steps} />
		</div>
		);



}