import axios from "../utils/request";


// /api/admin/message/page
// 获取站内消息列表
export const getMessagePage=async (params)=>{
    let {data}=await axios.post('/api/admin/message/page',params);
    return data;
}


// /api/admin/message/delete
// 删除消息
export const deleteMessage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/message/delete',params);
    return data;
}

// /api/admin/message/send
// 发送站内消息
export const sendMessage=async (params)=>{
    let {data}=await axios.post('/api/admin/message/send',params);
    return data;
}