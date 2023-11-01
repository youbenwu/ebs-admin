import axios from "../utils/request";

export const getCategoryList=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/shop/product/category/list',param);
    return data;
}
export const setCategory=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/shop/product/category/save',param);
    return data;
}
export const delCategory=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/shop/product/category/delete',param);
    return data;
}
export const productPage=async (param)=>{
    let {data}=await axios.post('/api/admin/mall/product/page',param);
    return data;
}

export const productSave=async (param)=>{
    let {data}=await axios.post('/api/admin/mall/product/save',param);
    return data;
}
export const productGet=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/get',param);
    return data;
}
export const productDelete=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/delete',param);
    return data;
}
export const productSetOnSell=async (param)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/setOnSell',param);
    return data;
}





