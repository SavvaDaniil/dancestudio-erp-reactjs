import constant from "../utils/GlobalValues";

export default class TeacherRateService {


    async add(jwt, teacher_id){
        return await fetch(constant.baseDomain + "/api/teacher_rate/add",
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
                "teacher_id" : teacher_id
            })
        }).then(res => res.json());
    }

    async delete(jwt, teacher_rate_id){
        ...
    }

    async update(jwt, teacher_rate_id, name, value){
        ...
    }


}