import React, {useState, useEffect, useRef} from "react"
import {notification, Table, Space, Pagination, Form, Input, Popconfirm} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './MsgTypeListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {$deleteMessageType, $getMessageTypePage} from "../../../api/MessageTypeAdminApi";
import MyDeleteButton from "../../../components/buttons/MyDeleteButton";
import MsgTypeEdit from "./MsgTypeEdit";


export default function MsgTypeListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10});
    const dataEdit=useRef();

    const [form] = Form.useForm();

    useEffect(()=>{
        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page?filtersFromParams.page:request.page;
        const size=filtersFromParams.size?filtersFromParams.size:request.size;
        request.page=page;
        request.size=size;

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}`);
        loadData().then();
    },[request]);




    const loadData=async ()=>{
        let {status,message,data}=await $getMessageTypePage({...request,sort:"updateTime,desc"});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDelete=async ({id})=>{
        let {status,message}=await $deleteMessageType({id:id});
        if(status==0){
            loadData().then();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onPageChange=(page,pageSize)=>{
        request.page=page-1;
        request.size=pageSize;
        setRequest({...request});
    }



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '类型标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '类型编码',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '站内信',
            dataIndex: 'msg',
            key: 'msg',
            render: (_, {msg}) => (
                msg?"是":"否"
            ),
        },
        {
            title: '短信',
            dataIndex: 'sms',
            key: 'sms',
            render: (_, {sms}) => (
                sms?"是":"否"
            ),
        },
        {
            title: 'APP推送',
            dataIndex: 'push',
            key: 'push',
            render: (_, {push}) => (
                push?"是":"否"
            ),
        },
        {
            title: '微信消息',
            dataIndex: 'mp',
            key: 'mp',
            render: (_, {mp}) => (
                mp?"是":"否"
            ),
        },
        {
            title: '邮件',
            dataIndex: 'email',
            key: 'email',
            render: (_, {email}) => (
                email?"是":"否"
            ),
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, {status}) => (
                status==0?"正常":"禁用"
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        size="small"
                        type="primary"
                        onClick={()=>{dataEdit.current.showModel(record)}}
                    >编辑</Button>
                    <MyDeleteButton
                        onConfirm={()=>{onDelete(record).then()}}
                    />
                </Space>
            ),
        },

    ];

    return (
        <>
            <div className="header">
                <Button onClick={()=>{dataEdit.current.showModel({})}}>新增</Button>
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
            <MsgTypeEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData().then()}}/>
        </>
    );

}