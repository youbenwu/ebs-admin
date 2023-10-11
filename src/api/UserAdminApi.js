import axios from "../utils/request";


// /api/admin/user/page
// 获取用户
export const getUserPage=async (param)=>{
    let {data}=await axios.postForm('/api/admin/user/page',param);
    //console.log(data);
    return data;
}

export const getUserCount=async (param)=>{
    let {data}=await axios.postForm('/api/admin/user/count',param);
    //console.log(data);
    return data;
}