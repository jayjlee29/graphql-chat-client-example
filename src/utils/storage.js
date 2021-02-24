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

function clearSession(){
    localStorage.clear();
}

export {setSession, getSession, clearSession}