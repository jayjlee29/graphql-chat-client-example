'use strict'
import axios from 'axios';
import {getSession, setSession, clearSession} from '../utils/storage'

import {API_SERVER } from './Config'
//const API_SERVER='https://graphql-mongodb-server-le4vpdu3yq-uc.a.run.app'


function signInAnonymous (displayName) {
    const sessionInfo = getSession();

    if(sessionInfo && sessionInfo.accessToken){
        return sessionInfo
    }

    return axios.get(`${API_SERVER}/signin/anonymous?displayName=${displayName}`).then((res)=>{
        const {accessToken, expiredAt, user} = res.data
        setSession({accessToken, expiredAt, user});
        return {
            accessToken, expiredAt, user
        }
    })

}

function getAccessToken (sessionInfo) {
    if(!sessionInfo){
        throw new Error('sessionInfo is null')
    }
    if(sessionInfo && sessionInfo.accessToken 
        && new Date().getTime() < new Date(sessionInfo.expiredAt).getTime()){
            //console.log('reuse sessionInfo', sessionInfo)
        return sessionInfo
    }

    if(!sessionInfo.user){
        throw new Error('user is null in sessionInfo')
    }
    const {user} = sessionInfo

    if(!user.id || !user.displayName){
        throw new Error('Error user id is undefined');
    }
    return axios.get(`${API_SERVER}/accessToken/anonymous?id=${user.id}&displayName=${user.displayName}`).then((res)=>{
        const {accessToken, expiredAt, user} = res.data
        console.log('Success get accessToken', res.status);
        setSession({accessToken, expiredAt, user});
        return res.data
    }).catch((error)=>{
        console.log(error);
    })

}

export {
    getAccessToken, signInAnonymous
}