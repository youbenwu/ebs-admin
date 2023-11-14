import axios from "../utils/request";


// /api/admin/mall/product/type/page
// 获取商品类型列表
export const getProductTypePage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/type/page',params);
    return data;
}

export const getProductTypeList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/type/list',params);
    return data;
}

// /api/admin/mall/product/type/save
// 保存商品类型
export const saveProductType=async (params)=>{
    let {data}=await axios.post('/api/admin/mall/product/type/save',params);
    return data;
}

// /api/admin/mall/product/type/get
// 获取商品类型
export const getProductType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/type/get',params);
    return data;
}

// /api/admin/mall/product/type/delete
// 删除商品类型
export const deleteProductType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/type/delete',params);
    return data;
}