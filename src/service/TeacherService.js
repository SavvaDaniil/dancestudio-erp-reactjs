import constant from "../utils/GlobalValues";


export default class TeacherService {


    async listAllLites(jwt){
        return await fetch(constant.baseDomain + "/api/teacher/list_all_lites",
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
            referrerPolicy: 'no-referrer'
        }).then(res => res.json());
    }

    async add(jwt, name){
        return await fetch(constant.baseDomain + "/api/teacher/add",
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
                "name" : name
            })
        }).then(res => res.json());
    }

    async get(jwt, teacher_id){
        ...
    }

    async delete(jwt, teacher_id){
        ...
    }

    async update(
        jwt, 
        teacher_id,
        name,
        stavka,
        min_students,
        raz,
        usual,
        unlim,
        stavka_plus,
        ...
    ){
        return await fetch(constant.baseDomain + "/api/teacher/update",
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
                "teacher_id" : teacher_id,
                "name" : name,
                "stavka" : stavka,
                "min_students" : min_students,
                "raz" : raz,
                "usual" : usual,
                "unlim" : unlim,
                "stavka_plus" : stavka_plus,
                ...
            })
        }).then(res => res.json());
    }

    async posterUpload(
        jwt, 
        teacher_id,
        poster_file
    ){
        var form_data = new FormData();
        form_data.append('jwt', jwt);
        form_data.append('teacher_id', teacher_id);
        form_data.append('poster_file', poster_file);

        ...
    }

    async posterDelete(
        jwt, 
        teacher_id
    ){

        ...
    }


}