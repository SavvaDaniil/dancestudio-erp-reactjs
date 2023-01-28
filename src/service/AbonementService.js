
import constant from "../utils/GlobalValues";

export default class AbonementService {

    async getForBuy(jwt, abonement_id){
        return await fetch(constant.baseDomain + "/api/abonement/get_for_buy",
        {
            method: 'POST',
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
                "abonement_id" : abonement_id
            })
        }).then(res => res.json());
    }

    async listAllLiteActive(jwt){
        return await fetch(constant.baseDomain + "/api/abonement/list_all_lite_active",
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            //credentials: 'include',
            headers: {
                'Authorization': 'Bearer '+ jwt, 
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        }).then(res => res.json());
    }

    async addAbonement(jwt, special_status, is_trial){
        ...
    }

    async search(jwt){
        ...
    }

    async delete(jwt, abonement_id){
        ...
    }

    async update(
        jwt, 
        abonement_id, 
        name, 
        days, 
        price, 
        visits, 
        ...
    ){
        return await fetch(constant.baseDomain + "/api/abonement/update",
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
                "abonement_id" : abonement_id,
                "name" : name,
                "days" : days,
                "price" : price,
                "visits" : visits,
                ...
            })
        }).then(res => res.json());
    }
}