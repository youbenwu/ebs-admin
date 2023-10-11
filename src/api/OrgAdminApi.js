import axios from "../utils/request";



export const $getOrg=async ({id})=>{
    let {data}=await axios.postForm('/api/admin/org/get',{id});
    return data;
}

export const $saveOrg=async (param)=>{
    let {data}=await axios.post('/api/admin/org/save',param);
    return data;
}


export const getAccountPage=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/account/page',param);
    return data;
}

export const saveAccount=async (param)=>{
    let {data}=await axios.post('/api/admin/org/account/save',param);
    return data;
}

export const deleteAccount=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/account/delete',param);
    return data;
}

export const setAccountRole=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/account/role/set',param);
    return data;
}


export const saveRole=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/role/save',param);
    return data;
}

export const getRoleList=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/role/list',param);
    return data;
}

// /api/admin/org/role/delete
// 删除角色
export const deleteRole=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/role/delete',param);
    return data;
}

//
// /api/admin/org/permission/listBySys
// 获取系统权限列表

export const getPermissionListBySys=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/permission/listBySys',param);
    return data;
}


// /api/admin/org/menu/listBySys
// 系统菜单列表

export const getMenuListBySys=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/menu/listBySys',param);
    return data;
}

// /api/admin/org/role/permission/list
// 获取角色权限列表

export const getRolePermissionList=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/role/permission/list',param);
    return data;
}

// /api/admin/org/role/permission/set
// 设置角色权限列表

export const setRolePermissionList=async (param)=>{
    let {data}=await axios.post('/api/admin/org/role/permission/set',param);
    return data;
}


// /api/admin/org/role/menu/list
// 获取角色菜单列表
export const getRoleMenuList=async (param)=>{
    let {data}=await axios.postForm('/api/admin/org/role/menu/list',param);
    return data;
}


// /api/admin/org/role/menu/set
// 设置角色菜单列表

export const setRoleMenuList=async (param)=>{
    let {data}=await axios.post('/api/admin/org/role/menu/set',param);
    return data;
}