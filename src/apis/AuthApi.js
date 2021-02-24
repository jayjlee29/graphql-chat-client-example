'use strict'
import axios from 'axios';
import {getSession, setSession, clearSession} from '../utils/storage'

import {API_SERVER } from './Config'
//const API_SERVER='https://graphql-mongodb-server-le4vpdu3yq-uc.a.run.app'


function signIn (username) {
    console.log('signin')
    const sessionInfo = getSession();

    if(sessionInfo && sessionInfo.accessToken){
        return sessionInfo
    }

    return axios.get(`${API_SERVER}/signin/anonymous?displayName=${username}`).then((res)=>{
        const {accessToken, expiredAt, user} = res.data
        setSession({accessToken, expiredAt, user});
        return {
            accessToken, expiredAt, user
        }
    })

}

function getAccessToken (sessionInfo) {
    console.log('getAccessToken', JSON.stringify(sessionInfo))
    if(!sessionInfo){
        //throw new Error('sessionInfo is null')
        console.warn('generating new session ')
    }
    if(sessionInfo && sessionInfo.accessToken 
        && new Date().getTime() < new Date(sessionInfo.expiredAt).getTime()){
            //console.log('reuse sessionInfo', sessionInfo)
        return sessionInfo
    }

    if(!sessionInfo.user){
        throw new Error('Error getAccessToken : user is null')
    }
    const {user} = sessionInfo
    return axios.get(`${API_SERVER}/accessToken/anonymous?id=${user.id}&username=${user.displayName}`).then((res)=>{
        //const {accessToken, expiredAt, user} = res.data
        console.log('getAccessToken'. res.status);
        return res.data
    }).catch((error)=>{
        console.log(error);
    })

}

export {
    getAccessToken, signIn
}