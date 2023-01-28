import constant from "../utils/GlobalValues";


export default class PurchaseAbonementService {


    async update(
        jwt, 
        purchase_abonement_id,
        price,
        cashless,
        visits_start,
        visits_left,
        days,
        date_of_buy,
        date_of_activation,
        ...
    ){
        return await fetch(constant.baseDomain + "/api/purchase_abonement/update",
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
                "purchase_abonement_id" : purchase_abonement_id,
                "price" : price,
                "cashless" : cashless,
                "visits_start" : visits_start,
                "visits_left" : visits_left,
                "days" : days,
                "date_of_buy" : date_of_buy,
                "date_of_activation" : date_of_activation,
                ...price
            })
        }).then(res => res.json());
    }

    async getForEdit(
        jwt, 
        purchase_abonement_id
    ){
        ...
    }

    async listAllLiteActiveForUserByDate(
        jwt, 
        user_id,
        date_of_buy
    ){
        ...
    }

    async listAllLitesOfUser(jwt, user_id){
        ...
    }

    async add(
        jwt, 
        user_id,
        abonement_id,
        dance_group_id,
        price,
        cashless,
        visits,
        ...
    ){
        return await fetch(constant.baseDomain + "/api/purchase_abonement/add",
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
                "user_id" : user_id,
                "abonement_id" : abonement_id,
                "dance_group_id" : dance_group_id,
                "price" : price,
                "cashless" : cashless,
                "visits" : visits,
                ...
            })
        }).then(res => res.json());
    }

    async delete(
        jwt, 
        purchase_abonement_id
    ){
        ...
    }

}