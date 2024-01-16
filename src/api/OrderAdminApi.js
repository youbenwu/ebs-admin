import axios from "../utils/request";


// /api/admin/mall/order/page
// 获取订单信息列表
export const $getOrderPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/order/page',params);
    return data;
}


// /api/admin/mall/order/count
export const getOrderCount=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/order/count',params);
    return data;
}


export const getOrderAmount=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/order/amount',params);
    return data;
}


// /api/admin/mall/order/delete
// 删除订单信息
export const $deleteOrder=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/order/delete',params);
    return data;
}

//获取订单数量和金额按状态统计
export const $getStatsOrderStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/order/stats/status',params);
    return data;
}


export const $setOrderStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/mall/order/setStatus',params);
    return data;
}