import React, {useState, useEffect, useRef} from "react"
import {notification, Table, Space, Pagination, Form} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './MsgTypeListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {
    $deleteMessageTemplate,
    $getMessageTemplatePage,
} from "../../../api/MessageTypeAdminApi";
import MyDeleteButton from "../../../components/buttons/MyDeleteButton";
import MsgTemplateEdit from "./MsgTemplateEdit";


export default function MsgTemplateListPage () {


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
        let {status,message,data}=await $getMessageTemplatePage({...request,sort:"updateTime,desc"});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDelete=async ({id})=>{
        let {status,message}=await $deleteMessageTemplate({id:id});
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


    const sendTypeMap={
        0:"站内信",
        1:"邮箱",
        2:"短信",
        3:"推送",
        4:"小程序消息",
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '模板名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '消息标题模板',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '消息内容模板',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '消息链接模板',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: '外部模板ID',
            dataIndex: 'templateId',
            key: 'templateId',
        },
        {
            title: '发送类型',
            dataIndex: 'sendType',
            key: 'sendType',
            render: (_, {sendType}) => (
               sendTypeMap[sendType]
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
            <MsgTemplateEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData().then()}}/>
        </>
    );

}