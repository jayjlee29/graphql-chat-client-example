'use strict'
import './ConversationList.css';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import {getSession, setSession, clearSession} from '../../utils/storage'
import { getChannels } from '../../apis/GraphqlApi'

export default function ConversationList(props) {
	const {signOutHandler} = props
	const [conversations, setConversations] = useState([]);
	useEffect(() => {
		//getConversations()
		
	},[])

	getChannels().then((data)=>{
		console.log("complete", data);
		let newConversations = data.getChannels.map(result => {
		return {
			photo: 'https://randomuser.me/api/portraits/women/41.jpg',
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
      <div className="conversation-list">
        <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" click={signOutHandler}/>
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        />
        <ConversationSearch />
        {
          conversations.map(conversation =>{
            return (
            // <a href onClick={()=>props.selectChannel(conversation)} >
            //   <ConversationListItem
            //     key={conversation.name}
            //     data={conversation}
            //   />
            // </a>
            <Link to={`/channel/${conversation.id}`}>
              <ConversationListItem
                      key={conversation.name}
                      data={conversation}/>
            </Link>
            )
          })
        }
      </div>
    );
}