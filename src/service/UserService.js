import constant from "../utils/GlobalValues";


export default class UserService {


    async update(
        jwt, 
        user_id,
        username,
        password,
        secondname,
        firstname,
        patronymic,
        telephone,
        ...
    ){
        return await fetch(constant.baseDomain + "/api/admin/user/profile/update",
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
                "username" : username,
                "password" : password,
                "secondname" : secondname,
                "firstname" : firstname,
                "patronymic" : patronymic,
                "telephone" : telephone,
                ...
            })
        }).then(res => res.json());
    }

    async getProfile(jwt, user_id){
        ...
    }

    async getSearchPreview(jwt, user_id){
        ...
    }

    async add(jwt, secondname, firstname, telephone, comment){
        ...
    }

    async search(jwt, page, query_string, is_need_count){
        ...
    }
    
}