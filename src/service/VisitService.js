import constant from "../utils/GlobalValues";



export default class VisitService {
    

    async listAllLiteOfUser(jwt, user_id, dance_group_id, date_of_action){
        return await fetch(constant.baseDomain + "/api/visit/list_all_lite_of_user",
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
                "dance_group_id" : dance_group_id,
                "date_of_action" : date_of_action
            })
        }).then(res => res.json());
    }


    async add(jwt, user_id, ...){
        return await fetch(constant.baseDomain + "/api/visit/add",
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
                "user_id" : user_id,
                ...
            })
        }).then(res => res.json());
    }

    async prepare(jwt, user_id, dance_group_id, date_of_action){
        ...
    }

    async delete(jwt, visit_id){
        ...
    }


}