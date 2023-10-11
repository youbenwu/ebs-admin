import axios from "../utils/request";

export const $login=async (param)=>{
    let {data}=await axios.postForm('/api/user/login',param);
    //console.log(data);
    return data;
}