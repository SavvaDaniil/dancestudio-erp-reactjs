import constant from "../utils/GlobalValues";



export default class TeacherSalaryService {


    async search(
        jwt,
        date_from,
        date_to,
        dance_group_id,
        teacher_id
    ){
        return await fetch(constant.baseDomain + "/api/teacher_salary/search",
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
                "date_from" : date_from,
                "date_to" : date_to,
                "dance_group_id" : dance_group_id,
                "teacher_id" : teacher_id
            })
        }).then(res => res.json());
    }
    
    async getSearchPrepare(jwt)
    {
        ...
    }

    async getMoreInfo(
        jwt,
        teacher_salary_id
    ){
        ...
    }

    async update(
        jwt,
        teacher_salary_id,
        name,
        value
    ){
        ...
    }

    async delete(
        jwt,
        teacher_salary_id
    ){
        ...
    }


}