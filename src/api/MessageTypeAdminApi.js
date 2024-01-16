import axios from "../utils/request";


export const $saveMessageType=async (params)=>{
    let {data}=await axios.post('/api/admin/message/type/save',params);
    return data;
}

export const $deleteMessageType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/message/type/delete',params);
    return data;
}

export const $getMessageType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/message/type/get',params);
    return data;
}

export const $getMessageTypePage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/message/type/page',params);
    return data;
}



export const $saveMessageTemplate=async (params)=>{
    let {data}=await axios.postForm('/api/admin/message/type/template/save',params);
    return data;
}

export const $deleteMessageTemplate=async (params)=>{
    let {data}=await axios.postForm('/api/admin/message/type/template/delete',params);
    return data;
}

export const $getMessageTemplate=async (params)=>{
    let {data}=await axios.postForm('/api/admin/message/type/template/get',params);
    return data;
}

export const $getMessageTemplatePage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/message/type/template/page',params);
    return data;
}





