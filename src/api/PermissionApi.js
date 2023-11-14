import axios from "../utils/request";

// /api/org/permission/list
// 获取权限列表
export const getPermissionList=async (param)=>{
    let {data}=await axios.postForm('/api/org/permission/list',param);
    return data;
}