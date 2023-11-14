import axios from "../utils/request";
import moment from 'moment'

///api/admin/hotel/register
// 注册酒店
export const registerHotel=async (params)=>{
    let {data}=await axios.post('/api/admin/hotel/register',params);
    return data;
}


// /api/admin/hotel/page

export const getHotelPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/page',params);
    return data;
}



// /api/admin/hotel/getByOrg
// 获取酒店信息

export const getHotelByOrg=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/getByOrg',params);
    return data;
}


// /api/admin/hotel/save
// 修改酒店信息

export const saveHotel=async (params)=>{
    let {data}=await axios.post('/api/admin/hotel/save',params);
    return data;
}


// /api/admin/hotel/setStatus
// 设置酒店状态

export const setHotelStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/setStatus',params);
    return data;
}



// /api/admin/hotel/list
// 获取登陆用户的酒店信息列表

export const getHotelList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/list',params);
    return data;
}

// /api/admin/hotel/get
// 获取酒店信息

export const getHotelInfo=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/get',params);
    return data;
}


export const getHotelStatsDays=async (params)=>{
    if(params.fromTime==null){
        let toTime=moment().format('YYYY-MM-DD HH:mm:ss')
        let fromTime=moment().add('days', -7).format('YYYY-MM-DD HH:mm:ss')
        params.fromTime=fromTime;
        params.toTime=toTime;
    }
    let {data}=await axios.postForm('/api/admin/hotel/addStatsDay',params);
    return data;
}

export const getHotelStatsMonths=async (params)=>{
    if(params.fromTime==null){
        let toTime=moment().format('YYYY-MM-DD HH:mm:ss')
        let fromTime=moment().add('months', -7).format('YYYY-MM-DD HH:mm:ss')
        params.fromTime=fromTime;
        params.toTime=toTime;
    }
    let {data}=await axios.postForm('/api/admin/hotel/addStatsMonth',params);
    return data;
}


export const getHotelCount=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/count',params);
    return data;
}


export const getHotelRoomTypePage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/type/page',params);
    return data;
}

export const getHotelRoomType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/type/get',params);
    return data;
}

export const saveHotelRoomType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/type/save',params);
    return data;
}

export const deleteHotelRoomType=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/type/delete',params);
    return data;
}


export const getHotelRoomPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/page',params);
    return data;
}

export const getHotelRoom=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/get',params);
    return data;
}

export const getHotelRoomByRoomNo=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/getByRoomNo',params);
    return data;
}

export const saveHotelRoom=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/save',params);
    return data;
}

export const deleteHotelRoom=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/delete',params);
    return data;
}

export const setHotelRoomStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/room/setStatus',params);
    return data;
}



export const getHotelCustomerPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/page',params);
    return data;
}

export const getHotelCumstomer=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/get',params);
    return data;
}

export const getHotelCumstomerByPhone=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/getByPhone',params);
    return data;
}

export const saveHotelCumstomer=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/save',params);
    return data;
}

export const deleteHotelCustomer=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/delete',params);
    return data;
}



// /api/admin/hotel/device/page
// 获取设备列表
export const getHotelDevicePage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/device/page',params);
    return data;
}


// /api/admin/hotel/device/save
// 保存设备

export const saveHotelDevice=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/device/save',params);
    return data;
}

export const getHotelDeviceCount=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/device/count',params);
    return data;
}


export const getHotelWorkOrderPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/workOrder/page',params);
    return data;
}

export const saveHotelWorkOrder=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/workOrder/save',params);
    return data;
}

export const deleteHotelWorkOrder=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/workOrder/delete',params);
    return data;
}

export const setHotelWorkOrderStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/workOrder/setStatus',params);
    return data;
}


export const getHotelStayPage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/stay/page',params);
    return data;
}

export const saveHotelStay=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/stay/save',params);
    return data;
}

export const deleteHotelStay=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/stay/delete',params);
    return data;
}

export const setHotelStayStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/hotel/customer/stay/setStatus',params);
    return data;
}