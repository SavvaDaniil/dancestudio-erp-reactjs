import constant from "../utils/GlobalValues";


export default class BranchService {
    
    async listAllLites(jwt){
        return await fetch(constant.baseDomain + "/api/branch/list_all_lites",
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

    async get(jwt, branch_id){
        return await fetch(constant.baseDomain + "/api/branch/get",
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
                "branch_id" : branch_id
            })
        }).then(res => res.json());
    }

    async add(jwt, name, coordinates, description){
        ...
    }

    async delete(jwt, branch_id){
        return await fetch(constant.baseDomain + "/api/branch/delete",
        {
            method: 'DELETE',
            ...
        }).then(res => res.json());
    }

    async update(
        jwt, 
        branch_id,
        name,
        coordinates,
        description,
    ){
        return await fetch(constant.baseDomain + "/api/branch/update",
        {
            method: 'PUT',
            ...
        }).then(res => res.json());
    }

}