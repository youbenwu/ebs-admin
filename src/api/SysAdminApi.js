import axios from "../utils/request";



// /api/admin/sys/page
// 获取系统信息
export const getSysPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/sys/page',params);
    return data;
}

// /api/admin/sys/save
// 保存系统信息
export const saveSys=async (params)=>{
    let {data}=await axios.postForm('/api/admin/sys/save',params);
    return data;
}

// /api/admin/sys/delete
// 删除系统信息
export const deleteSys=async (params)=>{
    let {data}=await axios.postForm('/api/admin/sys/delete',params);
    return data;
}


// /api/admin/sys/permission/list
// 获取系统权限列表
export const getSysPermissionList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/sys/permission/list',params);
    return data;
}


// /api/admin/sys/permission/set
// 设置系统权限列表
export const setSysPermissionList=async (params)=>{
    let {data}=await axios.post('/api/admin/sys/permission/set',params);
    return data;
}


// /api/admin/sys/menu/list
// 获取系统菜单列表
export const getSysMenuList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/sys/menu/list',params);
    return data;
}


// /api/admin/sys/menu/set
// 设置系统菜单列表
export const setSysMenuList=async (params)=>{
    let {data}=await axios.post('/api/admin/sys/menu/set',params);
    return data;
}