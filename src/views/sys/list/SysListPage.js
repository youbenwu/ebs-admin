import React, {useState, useEffect, useRef} from "react"
import {notification, Table, Space,Tooltip} from "antd";
import {Button} from 'antd'
import { createBrowserHistory } from "history";
import qs from "qs";
import {deleteSys, getSysPage} from "../../../api/SysAdminApi";
import MyDeleteButton from "../../../components/buttons/MyDeleteButton";
import "./SysListPage.scss"
import SysEdit from "./SysEdit";
import SysSetPermissionList from "./SysSetPermissionList";
import SysSetMenuList from "./SysSetMenuList";

export default function SysListPage () {


    const [loading, setLoading] = useState(false);
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10});
    const [data,setData]=useState({});

    const dataEdit=useRef();
    const permissionsEdit=useRef();
    const menusEdit=useRef();

    useEffect(()=>{

        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page??0;
        const size=filtersFromParams.size??10;
        request.page=page;
        request.size=size;

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}`);
        loadData().then();
    },[request]);

    const loadData=async ()=>{
        setLoading(true);
        let {status,message,data}=await getSysPage(request);
        setLoading(false);
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDelete= async({id})=>{
        setLoading(true);
        let {status,message}=await deleteSys({id:id});
        setLoading(false);
        if(status==0){
            loadData().then();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onTableChange = (pagination, filters, sorter) => {

        setRequest(
            {
                ...request,
                page:pagination.current-1,
                size:pagination.pageSize,
            }
        );

        if (request.page !== data.pageable?.pageNumber) {
            setData({});
        }

    };

    /**
     *
     * 组织类型
     * 0--平台
     * 1--租户
     * 2--部门
     * 3--商家
     * 4--门店
     * 5--店铺
     * 6--酒店
     *
     */
    const typesMap={
        0:"平台",
        1:"租户",
        2:"部门",
        3:"商家",
        4:"门店",
        5:"店铺",
        6:"酒店",
    };

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
            ellipsis: {
                showTitle: false,
            },
            render: (name) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            ),
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: {
                showTitle: false,
            },
            render: (description) => (
                <Tooltip placement="topLeft" title={description}>
                    {description}
                </Tooltip>
            ),
        },
        {
            title: 'LOGO',
            key: 'logo',
            render: (_, {logo}) => (
                <img src={logo} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '编码',
            dataIndex: 'sysNo',
            key: 'sysNo',
        },
        {
            title: '类型',
            key: 'type',
            render: (_, {type}) => (
                (typesMap[type])
            ),
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
                    <Button size="small" type="primary" onClick={()=>{dataEdit.current.showModel(record)}}>编辑</Button>
                    <MyDeleteButton onConfirm={()=>{onDelete(record).then()}}/>
                    <Button size="small" onClick={()=>{permissionsEdit.current.showModel(record)}}>设置权限</Button>
                    <Button size="small" onClick={()=>{menusEdit.current.showModel(record)}}>设置菜单</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="header">
                <Button onClick={()=>{dataEdit.current.showModel({})}}>新增</Button>
            </div>
            <Table
                columns={columns}
                rowKey="id"
                dataSource={data.content}
                pagination= {{
                    current: request.page+1,
                    pageSize: request.size,
                    total:data.totalElements,
                }}
                onChange={onTableChange}
                loading={loading}
                size="small"
                scroll={{
                    y: 500,
                }}
            />
           <SysEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData().then()}}/>
           <SysSetPermissionList cref={permissionsEdit} onEditFinish={(r)=>{if(r)loadData().then()}}/>
           <SysSetMenuList cref={menusEdit} onEditFinish={(r)=>{if(r)loadData().then()}}/>
        </>
    );

}