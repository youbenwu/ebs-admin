import axios from "../utils/request";


// /api/admin/mall/order/count
export const getOrderCount=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/order/count',params);
    return data;
}


export const getOrderAmount=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/order/amount',params);
    return data;
}
