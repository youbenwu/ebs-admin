import axios from "../utils/request";


// /api/admin/portal/data/stats/page
// 获取列表
export const getDataStatsPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/data/stats/page',params);
    return data;
}


// /api/admin/portal/data/stats/delete
// 删除
export const deleteDataStats=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/data/stats/delete',params);
    return data;
}

// /api/admin/portal/data/stats/save
// 保存
export const saveDataStats=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/data/stats/save',params);
    return data;
}



