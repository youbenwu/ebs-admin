import axios from "../utils/request";


// /api/admin/mall/product/category/list
// 获取商品类别列表
export const getProductCategoryList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/category/list',params);
    return data;
}

// /api/admin/mall/product/category/save
// 保存商品类别
export const saveProductCategory=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/category/save',params);
    return data;
}

// /api/admin/mall/product/category/delete
// 删除商品类别
export const deleteProductCategory=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/product/category/delete',params);
    return data;
}


// /api/admin/mall/product/category/sort
// 商品类别排序
export const sortProductCategory=async (params)=>{
    let {data}=await axios.post('/api/admin/mall/product/category/sort',params);
    return data;
}


