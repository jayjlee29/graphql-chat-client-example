'use strict'
import { gql, useQuery, useSubscription } from '@apollo/client';

function getChannels() {

    return new Promise((resolve, reject)=>{

        const GET_CHANNELS = gql`
        query getChannels($pageNo: Int!, $pageSize: Int!) {
            getChannels(pageNo:$pageNo, pageSize: $pageSize){
            id
            title
            description
            status
            createdAt
            }
        }`

        useQuery(GET_CHANNELS,
            { variables: { pageNo: 1, pageSize: 100 },
                onCompleted: (data)=>{
                    resolve(data);
                },
                onError: (error)=>{
                    console.error(error)
                    reject(error)
                }
            })

        
    })
    
}

function getChannelMessages(channelId) {
    return new Promise((resolve, reject)=>{
        const GET_CHANNEL_MESSAGES = gql`
        query loadInitChannelMessages($channelId: String!, $latestMessageId: String, $size: Int) {
            getChannelMessages(channelId: $channelId,  latestMessageId: $latestMessageId, size: $size){
            id
            payload
            userId
            createdAt
            }
        }`

        useQuery(GET_CHANNEL_MESSAGES,
        { 
            variables: { channelId, size: 20 },
            fetchPolicy: "no-cache",
            onCompleted: (data)=>{
                resolve(data)
            },
            onError: (error)=>{
                reject(error)
            }
        })
    })
}


export { getChannels, getChannelMessages }