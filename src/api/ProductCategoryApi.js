import axios from "../utils/request";


// /api/mall/product/category/list
// 获取商品类别列表
export const getProductCategoryList=async (params)=>{
    let {data}=await axios.postForm('/api/mall/product/category/list',params);
    return data;
}


