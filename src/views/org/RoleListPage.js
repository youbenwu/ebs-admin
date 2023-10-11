import {useState,useEffect,useRef,useInsertionEffect} from "react"
import {deleteRole, getRoleList} from "../../api/OrgAdminApi";
import {getOrgId, saveUser} from "../../utils/StorageUtils";
import {notification, Table, Space, Pagination, Popconfirm} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import RoleEdit from "./RoleEdit";
import './RoleListPage.scss'
import {deleteMessage} from "../../api/MessageAdminApi";
import SelectPerList from "./SelectPerList";
import SelectMenuList from "./SelectMenuList";


export default function RoleListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const roleEdit=useRef();
    const selectPer=useRef();
    const selectMenu=useRef();

    useEffect(()=>{
        loadData();
    },[]);


    const loadData=async ()=>{
        let orgId=getOrgId();
        let {status,message,data}=await getRoleList({orgId:orgId});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDeleteRole=async ({id})=>{
        let {status,message}=await deleteRole({id:id});
        if(status==0){
            loadData();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{
                        roleEdit.current.showModel({data:record})
                    }}>编辑</Button>
                    <Popconfirm
                        title="提示"
                        description="确定删除该条记录吗?"
                        onConfirm={()=>{onDeleteRole(record)}}
                        onCancel={()=>{}}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button size="small">删除</Button>
                    </Popconfirm>
                    <Button size="small"  onClick={()=>{selectPer.current.showModel({data:record})}}>设置权限</Button>
                    <Button size="small"  onClick={()=>{selectMenu.current.showModel({data:record})}}>设置菜单</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="header">
                <Button onClick={()=>{roleEdit.current.showModel({data:{}})}}>新增</Button>
            </div>
            <Table columns={columns} dataSource={data} pagination={false}/>
            <RoleEdit cref={roleEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
            <SelectPerList cref={selectPer} onEditFinish={()=>{}}/>
            <SelectMenuList cref={selectMenu} onEditFinish={()=>{}}/>
        </>
    );

}