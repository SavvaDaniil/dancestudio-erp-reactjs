import constant from "../utils/GlobalValues";


export default class DanceGroupDayOfWeekService {

    async add(jwt, dance_group_id, is_event){
        return await fetch(constant.baseDomain + "/api/dance_group_day_of_week/add",
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
                "dance_group_id" : dance_group_id,
                "is_event" : is_event
            })
        }).then(res => res.json());
    }

    async update(jwt, dance_group_day_of_week_id, name, value){
        ...
    }

    async delete(jwt, dance_group_day_of_week_id){
        ...
    }

}