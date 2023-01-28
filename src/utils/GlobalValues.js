


function getBaseDomain(){
    if((window.location.hostname).indexOf("localhost") + 1){
        return "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    } else {
        return "";
    }
}


const constant = {
    "baseDomain" : getBaseDomain(),
}

export default constant;