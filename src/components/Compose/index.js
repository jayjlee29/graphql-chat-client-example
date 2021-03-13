import React, {useEffect, useState, useRef}  from 'react';
import './Compose.css';
import { gql, useQuery, useMutation } from '@apollo/client';


const PUBLISH_CHANNEL_MESSAGE = gql`
  mutation publishChannelMessage($channelId: String!, $payload: String!){
      publishChannelMessage(channelId: $channelId, 
        payload: $payload) {
      channelId
      payload	
      createdAt
    }
  }
`
export default function Compose(props) {
    const [input, setInput] = useState('');
    const {channelId} = props
	console.log('Compose channelId', channelId)
	const [PUBLISH] = useMutation(PUBLISH_CHANNEL_MESSAGE,{
		onCompleted: (data)=>{
			console.log('published message', data)
			clearInput()
			//e.target.value = '';
		}, onError: (error)=>{
			console.error(error)
			clearInput()
		}
	} )
	const clearInput = () =>{
		document.getElementById('input').value = ''

	}
	const handleChange = (e) => {
		e.preventDefault();
		const keyCode = e.keyCode || e.which;
		
		if (keyCode === 13 && e.target.value) {
			
			if(channelId){
				
				PUBLISH({
					variables: {
					channelId: channelId,
					payload: e.target.value
					}
				})
			} else {
				alert('channel is not selected')
			}
			
			clearInput()
			
		}
		
	}

	if(channelId){
		return (
			<div className="compose">
			  <input
				id="input"
				type="text"
				className="compose-input"
				placeholder="Type a message"
				autoComplete="off"
				autofocus
				onKeyUp={(e)=>{handleChange(e);return false;}}
			  />
	  
			  {
				//props.rightItems
			  }
			</div>
		  );
	} else {
		return (
			<div className="compose">
			  <input
				id="input"
				type="text"
				className="compose-input"
				placeholder="must select channel"
				disabled="disabled"
				onKeyUp={handleChange}
				autoComplete="off"
			  />
	  
			  {
				//props.rightItems
			  }
			</div>
		  );
	}

    
}