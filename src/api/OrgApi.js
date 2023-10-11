import axios from "../utils/request";

export const $getMenuList=async (param)=>{
    let {data}=await axios.postForm('/api/org/menu/list',param);
    return data;
}

// /api/org/permission/list
// 获取权限列表

export const getPermissionList=async (param)=>{
    let {data}=await axios.postForm('/api/org/permission/list',param);
    return data;
}