import {useState,useEffect} from "react"
import {$getOrg} from "../../api/OrgAdminApi";
import {getOrgId, saveUser} from "../../utils/StorageUtils";
import {notification} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'


export default function OrgPage () {
    const navigate=useNavigate();

    useEffect(()=>{
        loadData();
    },[]);

    const [data,setData]=useState({});

    const loadData=async ()=>{
        let orgId=getOrgId();
        let {status,message,data}=await $getOrg({id:orgId});
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    return (
        <>
            <h3>组织信息</h3>
            <p>组织名称：{data.name}</p>
            <p>组织简介：{data.intro}</p>
            <p>联系人  ：{data.contact?.name}</p>
            <p>联系电话：{data.contact?.phone}</p>
            <Button onClick={()=>{
                navigate("/org/edit");
            }}>编辑</Button>
        </>
    );

}