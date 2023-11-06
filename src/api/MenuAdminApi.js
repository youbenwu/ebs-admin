import axios from "../utils/request";




// /api/admin/org/menu/list
// 菜单列表
export const getMenuList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/org/menu/list',params);
    return data;
}

// /api/admin/org/menu/save
// 保存菜单
export const saveMenu=async (params)=>{
    let {data}=await axios.postForm('/api/admin/org/menu/save',params);
    return data;
}


// /api/admin/org/menu/delete
// 删除菜单
export const deleteMenu=async (params)=>{
    let {data}=await axios.postForm('/api/admin/org/menu/delete',params);
    return data;
}

export const sortMenu=async (params)=>{
    let {data}=await axios.post('/api/admin/org/menu/sort',params);
    return data;
}