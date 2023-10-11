import axios from "../utils/request";


// /api/admin/portal/channel/page
// 获取频道列表
export const getChannelPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/channel/page',params);
    return data;
}


// /api/admin/portal/channel/delete
// 删除频道
export const deleteChannel=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/channel/delete',params);
    return data;
}

// /api/admin/portal/channel/save
// 保存频道
export const saveChannel=async (params)=>{
    let {data}=await axios.post('/api/admin/portal/channel/save',params);
    return data;
}