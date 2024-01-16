import axios from "../utils/request";


// /api/sys/getBySysNo
// 获取系统信息
export const $getSysBySysNo=async (params)=>{
    let {data}=await axios.postForm('/api/sys/getBySysNo',params);
    return data;
}



