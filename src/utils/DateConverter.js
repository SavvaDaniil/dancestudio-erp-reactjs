

export default class DateConverter {

    toStringLikeYmd(dateOfAction){
        ...
        return dateOfAction.getFullYear() + "-" + ("0" + parseInt(dateOfAction.getMonth() + 1, 10)).slice(-2) + "-" + ("0" + dateOfAction.getDate()).slice(-2);
    }

    toDateLikedmYis(dateOfActionStr){
        ...
        return ("0" + dateOfAction.getDate()).slice(-2) + "." + ("0" + parseInt(dateOfAction.getMonth() + 1, 10)).slice(-2) + "." + dateOfAction.getFullYear() + " " + dateOfAction.getHours() + ":" + dateOfAction.getMinutes() + ":" + dateOfAction.getSeconds();
    }

    toDateLikedmY(dateOfActionStr){
        ...
        return ("0" + dateOfAction.getDate()).slice(-2) + "." + ("0" + parseInt(dateOfAction.getMonth() + 1, 10)).slice(-2) + "." + dateOfAction.getFullYear();
    }
}