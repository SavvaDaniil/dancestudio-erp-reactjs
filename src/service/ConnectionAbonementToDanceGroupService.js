import constant from "../utils/GlobalValues";


export default class ConnectionAbonementToDanceGroupService {

    async update(jwt, dance_group_id, abonement_id, value){
        return await fetch(constant.baseDomain + "/api/connection_abonement_to_dance_group/update",
        {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            //credentials: 'include',
            headers: {
                'Authorization': 'Bearer '+ jwt, 
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
                "dance_group_id" : dance_group_id,
                "abonement_id" : abonement_id,
                "value" : value
            })
        }).then(res => res.json());
    }


}