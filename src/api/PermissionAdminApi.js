import axios from "../utils/request";


// /api/admin/org/permission/list
// 获取权限列表
export const getPermissionList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/org/permission/list',params);
    return data;
}

// /api/admin/org/permission/save
// 保存权限
export const savePermission=async (params)=>{
    let {data}=await axios.postForm('/api/admin/org/permission/save',params);
    return data;
}

// /api/admin/org/permission/delete
// 删除权限
export const deletePermission=async (params)=>{
    let {data}=await axios.postForm('/api/admin/org/permission/delete',params);
    return data;
}