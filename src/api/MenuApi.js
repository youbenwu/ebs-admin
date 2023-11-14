import axios from "../utils/request";


export const getMenuList=async (param)=>{
    let {data}=await axios.postForm('/api/org/menu/list',param);
    return data;
}

