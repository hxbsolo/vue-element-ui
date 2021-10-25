import axios from 'axios';
export function loginRef (data){
    return axios({
        url:'login',
        data,
        method:'POST'
    })
}