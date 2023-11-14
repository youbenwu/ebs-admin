import axios from "../utils/request";


// /api/admin/mall/product/bsType/list
// 获取商品业务类型列表
export const getProductBsTypeList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/bsType/list',params);
    return data;
}

// /api/admin/mall/product/bsType/save
// 保存商品业务类型
export const saveProductBsType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/bsType/save',params);
    return data;
}

// /api/admin/mall/product/bsType/delete
// 删除商品业务类型
export const deleteProductBsType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/bsType/delete',params);
    return data;
}


// /api/admin/mall/product/type/enum
// 获取商品类型枚举
export const getProductTypeEnum=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/type/enum',params);
    return data;
}

// /api/admin/mall/product/save
// 保存商品信息
export const saveProduct=async (params)=>{
    let {data}=await axios.post('/api/admin/mall/product/save',params);
    return data;
}

// /api/admin/mall/product/delete
// 删除商品信息
export const deleteProduct=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/delete',params);
    return data;
}

// /api/admin/mall/product/get
// 获取商品信息
export const getProduct=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/get',params);
    return data;
}

// /api/admin/mall/product/page
// 获取商品信息列表
export const getProductPage=async (params)=>{
    let {data}=await axios.post('/api/admin/mall/product/page',params);
    return data;
}

