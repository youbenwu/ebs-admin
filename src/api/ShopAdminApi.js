import axios from "../utils/request";



export const getSpCategoryList=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/shop/product/category/list',param);
    return data;
}
export const saveSpCategory=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/shop/product/category/save',param);
    return data;
}
export const deleteSpCategory=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/shop/product/category/delete',param);
    return data;
}

export const sortSpCategory=async (params)=>{
    let {data}=await axios.post('/api/admin/mall/shop/product/category/sort',params);
    return data;
}


