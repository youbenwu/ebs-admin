import axios from "../utils/request";


export const $getOrgList=async ({type})=>{
    let {data}=await axios.postForm('/api/org/list',{type});
    return data;
}