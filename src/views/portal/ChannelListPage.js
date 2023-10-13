import {useState,useEffect,useRef} from "react"

import {getOrgId} from "../../utils/StorageUtils";
import {notification, Table, Space, Pagination, Popconfirm} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './ChannelListPage.scss'
import ChannelEdit from "./ChannelEdit";
import {createBrowserHistory} from "history";
import qs from "qs";
import {deleteAdvertChannel, getAdvertChannelPage} from "../../api/AdvertAdminApi";


export default function ChannelListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const channelEdit=useRef();
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10});


    useEffect(()=>{
        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page?filtersFromParams.page:request.page;
        const size=filtersFromParams.size?filtersFromParams.size:request.size;
        request.page=page;
        request.size=size;
        loadData({page:page,size:size});

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}`);
    },[request]);



    const loadData=async ({page,size})=>{
        let orgId=getOrgId();
        let {status,message,data}=await getAdvertChannelPage({orgId:orgId,page:page,size:size});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDeleteChannel=async ({id})=>{
        let {status,message}=await deleteAdvertChannel({id:id});
        if(status==0){
            loadData({page:request.page,size:request.size});
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onPageChange=(page,pageSize)=>{
        setRequest({page:page-1,size:pageSize});
        loadData({page:page-1,size:pageSize});
    }


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
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
                        channelEdit.current.showModel({data:record})
                    }}>编辑</Button>
                    <Popconfirm
                        title="提示"
                        description="确定删除该条记录吗?"
                        onConfirm={()=>{onDeleteChannel(record)}}
                        onCancel={()=>{}}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button size="small">删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="header">
                <Button onClick={()=>{channelEdit.current.showModel({data:{}})}}>新增</Button>
            </div>
            <Table columns={columns} dataSource={data.content} pagination={false}/>
            <Pagination
                style={{marginTop:"10px"}}
                total={data.totalElements}
                pageSize={request.size}
                current={request.page+1}
                size="small"
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
                onChange={onPageChange}
            />
            <ChannelEdit cref={channelEdit} onEditFinish={(r)=>{if(r)loadData({page:request.page,size:request.size})}}/>

        </>
    );

}