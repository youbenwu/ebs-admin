import axios from "../utils/request";



// /api/mall/merchant/getByOrg
// 获取酒店信息

export const $getMerchantByOrg=async (params)=>{
    let {data}=await axios.postForm('/api/mall/merchant/getByOrg',params);
    return data;
}


export const $getMerchant=async (params)=>{
    let {data}=await axios.postForm('/api/mall/merchant/get',params);
    return data;
}

