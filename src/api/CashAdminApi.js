import axios from "../utils/request";


// /api/admin/wallet/cash/page
// 获取提现列表
export const $getCashPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/wallet/cash/page',params);
    return data;
}

// /api/admin/wallet/cash/setStatus
// 设置提现状态
export const $setCashStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/wallet/cash/setStatus',params);
    return data;
}

export const $deleteCash=async (params)=>{
    let {data}=await axios.postForm('/api/admin/wallet/cash/delete',params);
    return data;
}

export const $getStatsCashStatusList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/wallet/cash/stats/status',params);
    return data;
}