import axios from "../utils/request";



// /api/hotel/getByOrg
// 获取酒店信息

export const $getHotelByOrg=async (params)=>{
    let {data}=await axios.postForm('/api/hotel/getByOrg',params);
    return data;
}



