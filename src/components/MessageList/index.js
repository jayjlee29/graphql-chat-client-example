'use strict'
import React, {useEffect, useState, useRef} from 'react';
import { ChatFeed, Message, ChatInput } from 'react-chat-ui'

import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
//import Message from '../Message';
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



export default function MessageList(props) {

	const {sessionInfo, match } = props
	const { channelId } = match.params
	const messageRef = useRef();
	const [messages, setMessages] = useState([])
	const [authors, setAuthors] = useState([])
	//console.log('MessageList sessionInfo', JSON.stringify(sessionInfo))
	useEffect(()=>{
		//scrollToBottom()
	}, []);
	
	const scrollToBottom = () => {
		console.log('messageRef', messageRef, messageRef.current)
		if (messageRef.current) {
			messageRef.current.scrollIntoView(
			  {
				behavior: 'smooth',
				block: 'end',
				inline: 'nearest'
			  })
		  }
	}

	getChannelMessages(channelId).then((data)=>{
		console.log("get channel messages", data);
		const messageList = removeDuplicatedObject([...data.getChannelMessages])
		
		setMessages(messageList.map((msg, idx)=>{
			console.log(sessionInfo.user.userId, msg.userId)
			return new Message({
				id: sessionInfo.user.userId === msg.userId?0:msg.id,
				message: msg.payload,
				senderName: msg.userId
			})
		}))

	}).catch((err)=>{
		console.error(err)
	})

	const {error} = useSubscription(SUBSCRIPTION_CHANNEL,
		{ 
			variables:{ channelId },
			onSubscriptionData: ({client, subscriptionData})=>{
				const {data} = subscriptionData
				const channelMessage = data.channel;
				const channel = channelMessage.channel;
				const msg = channelMessage.message[0]

				const messageList = [...messages, new Message({
					id: sessionInfo.user.userId === msg.userId?0:msg.id,
					message: msg.payload,
					senderName: msg.userId
				})]
				setMessages(messageList)

			}
		});

	if(error){
		console.error('Error subscription', error);
	}

	function removeDuplicatedObject(srcs){
		//console.log(srcs)
		const temp = {}
		srcs.forEach((it)=>{
			if(!temp[it.id]){
				temp[it.id] = it
			}
			
		})
		const returnList = Object.values(temp);
		returnList.sort((a, b)=>{
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		})

		return returnList
	}


	return(
		<div className="message-list">
			<div className="message-list-container" >
			<ChatFeed
				
				messages={messages} // Array: list of message objects
				isTyping={false} // Boolean: is the recipient typing
				hasInputField={false} // Boolean: use our input, or use your own
				showSenderName={true} // show the name of the user who sent the message
				bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
				maxHeight={800}
				// JSON: Custom bubble styles
				bubbleStyles={
					{
						text: {
							fontSize: 15
						},
						chatbubble: {
							borderRadius: 10,
							padding: 10
						}
					}
				}
				/>

			</div>
			<div className="message-list-input">
				<Compose {...props} channelId={channelId} rightItems={[
					<ToolbarButton key="photo" icon="ion-ios-camera" />,
					<ToolbarButton key="image" icon="ion-ios-image" />,
					<ToolbarButton key="audio" icon="ion-ios-mic" />,
					<ToolbarButton key="money" icon="ion-ios-card" />,
					<ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
					<ToolbarButton key="emoji" icon="ion-ios-happy" />
					]}/>
			</div>
		</div>
		
		);



}