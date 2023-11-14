import {useState, useEffect, useRef} from "react"
import {notification,Space} from "antd"
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import HotelEdit from "./HotelEdit"
import './HotelPage.scss'
import {getHotel} from "../../utils/StorageUtils";
import {getHotelInfo} from "../../api/HotelAdminApi";

export default function HotelPage () {
    const navigate=useNavigate();

    const hotelEdit=useRef();

    useEffect(()=>{
        loadData();
    },[]);

    const [data,setData]=useState({});

    const loadData=async ()=>{
        let hotel=getHotel();
        console.log(hotel)
        let {status,message,data}=await getHotelInfo({id:hotel.id});
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    return (
        <Space direction="vertical">
            <h3>酒店信息</h3>
            <div className='div-row'>
                <div style={{width:80}}>酒店名称：</div><div>{data.name}</div>
            </div>
            <div className='div-row'>
                <div style={{width:80}}>酒店简介：</div><div>{data.intro}</div>
            </div>
            <div className='div-row'>
                <div style={{width:80}}>酒店LOGO：</div><img src={data.logo} style={{width:100,height:100}}/>
            </div>
            <div className='div-row'>
                <div style={{width:80}}>酒店图片：</div><a onClick={()=>{
                const w=window.open('about:blank');
                w.location.href=data.image;
            }}><img src={data.image} style={{width:300,height:300}}/></a>
            </div>
            <div className='div-row'>
                <div style={{width:80}}>营业执照：</div><a onClick={()=>{
                const w=window.open('about:blank');
                w.location.href=data.license;
            }}><img src={data.license} style={{width:300,height:300}}/></a>
            </div>
            <div className='div-row'>
                <div style={{width:80}}>联系人  ：</div><div>{data.contact?.name}</div>
            </div>
            <div className='div-row'>
                <div style={{width:80}}>联系电话：</div><div>{data.contact?.phone}</div>
            </div>
            <Button onClick={()=>{
                hotelEdit.current.showModel({data:data})
            }}>编辑</Button>
            <HotelEdit cref={hotelEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
        </Space>
    );

}