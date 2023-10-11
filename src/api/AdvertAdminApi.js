import axios from "../utils/request";


// /api/admin/portal/advert/page
// 获取广告信息列表
export const getAdvertPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/advert/page',params);
    return data;
}


// /api/admin/portal/advert/delete
// 删除广告信息
export const deleteAdvert=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/advert/delete',params);
    return data;
}


// /api/admin/portal/advert/save
// 保存广告信息
export const saveAdvert=async (params)=>{
    let {data}=await axios.post('/api/admin/portal/advert/save',params);
    return data;
}

// /api/admin/portal/advert/setStatus
// 设置广告状态
export const setAdvertStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/advert/setStatus',params);
    return data;
}