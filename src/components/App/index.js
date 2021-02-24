import React,{ useState, useEffect }  from 'react';
import { BrowserRouter } from 'react-router-dom';

import Messenger from '../Messenger';
import { split, HttpLink, ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import Signin from '../Signin'
import {getAccessToken, signIn} from '../../apis/AuthApi'
import {getSession, setSession, clearSession} from '../../utils/storage'
import { SERVER_URI, WS_SERVER_URI } from '../../apis/Config'
export default function App() {

  const [sessionInfo, setSessionInfo] = useState(null)

  useEffect(()=>{
    const s = getSession();
    console.log('useEffect', s)
    if(s){
      setSessionInfo(s)
    }
	}, [])



  const httpLink = new HttpLink({
    uri: SERVER_URI,
  });

  const authLink = setContext(async (_, { headers }) =>  {
    // get the authentication token from local storage if it exists
    //const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    try{
      const {accessToken, expiredAt, user} = await getAccessToken(sessionInfo)
      setSession({accessToken, expiredAt, user});
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${accessToken}`,
        }
      }
    } catch(err){
      console.error('Error Graphql establishing', err)
      throw new Error('Error Graphql establishing')
    }
    
  });

  const wsLink = new WebSocketLink({
    uri: WS_SERVER_URI,
    options: {
      reconnect: true,
      connectionParams: async () => {
        try{
          const {accessToken, expiredAt, user} = await getAccessToken(sessionInfo)
          setSession({accessToken, expiredAt, user});
          return {
            authToken: `Bearer ${accessToken}`
          }
        } catch(err){
          console.error('Error Subscription establishing', err)
          throw new Error('Error Subscription establishing')
        }
      }
    }
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );


  const client = new ApolloClient({
    uri: SERVER_URI,
    cache: new InMemoryCache({
		resultCaching: false
	}),
    link: splitLink
  });

  
  

  const signInHandler = async ({username}) =>{
    const {accessToken, expiredAt, user} = await signIn(username)
    const session = {accessToken, expiredAt, user}
    console.log('signInHandler success', session)
	  setSession(session)
    setSessionInfo(session)
	
  }

  const signOutHandler = () =>{
		console.log('signOutHandler')
		clearSession()
		setSessionInfo(null);
  }

  if(!sessionInfo ) {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <Signin signInHandler={signInHandler} />
        </ApolloProvider>
      </div>
    )
  } else {
    return (
     
      <div className="App">
        <ApolloProvider client={client}>
            <BrowserRouter>
              <Messenger signOutHandler={signOutHandler} sessionInfo={sessionInfo}/>
            </BrowserRouter>
        </ApolloProvider>
      </div>
      
    );
  }
  
}