function setSession(sessionInfo){
    // setter
    localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));

}

function getSession(){
    const str = localStorage.getItem('sessionInfo');

    try{
        if(str){
            return JSON.parse(str)
        }
    } catch(e){
        console.error('Error getSession', e)
    }
    return null;    
}
function getUserInfo(){
    const sessionInfo = getSession()
    if(sessionInfo && sessionInfo.user){
        return sessionInfo.user;
    }

    return null;
}
function clearSession(){
    localStorage.clear();
}

export {setSession, getSession, clearSession, getUserInfo}