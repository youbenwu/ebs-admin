import axios from "../utils/request";


// /api/admin/portal/channel/page
// 获取频道列表
export const getAdvertChannelPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/advert/channel/page',params);
    return data;
}


// /api/admin/portal/channel/delete
// 删除频道
export const deleteAdvertChannel=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/advert/channel/delete',params);
    return data;
}

// /api/admin/portal/channel/save
// 保存频道
export const saveAdvertChannel=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/advert/channel/save',params);
    return data;
}



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