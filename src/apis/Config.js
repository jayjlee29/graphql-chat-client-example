
const API_SERVER=process.env.API_SERVER || 'http://localhost:8000'
const WS_SERVER=process.env.WS_SERVER || 'ws://localhost:8000'
// const API_SERVER='https://graphql-mongodb-server-le4vpdu3yq-uc.a.run.app'
// const WS_SERVER='wss://graphql-mongodb-server-le4vpdu3yq-uc.a.run.app'
const SERVER_URI = `${API_SERVER}/graphql`
const WS_SERVER_URI = `${WS_SERVER}/graphql`
export {
    SERVER_URI, WS_SERVER_URI, WS_SERVER, API_SERVER
}