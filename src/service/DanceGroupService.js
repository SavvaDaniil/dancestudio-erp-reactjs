import constant from "../utils/GlobalValues";


export default class DanceGroupService {
    

    async getScheduleByDate(jwt, date_str){
        ...
    }

    async update(jwt, 
        dance_group_id,
        name,
        teacher_id,
        description,
        status,
        status_for_app,
        ...
    ){
        return await fetch(constant.baseDomain + "/api/dance_group/update",
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
                "name" : name,
                "teacher_id" : teacher_id,
                "description" : description,
                "status" : status,
                "status_for_app" : status_for_app,
                ...
            })
        }).then(res => res.json());
    }

    async getEdit(jwt, dance_group_id){
        ...
    }

    async listAllEditPreviews(jwt){
        ...
    }

    async add(jwt, name){
        ...
    }

    async delete(jwt, dance_group_id){
        ...
    }


}