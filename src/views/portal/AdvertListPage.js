import React, {useState,useEffect,useRef} from "react"

import {getOrgId, getOrgType} from "../../utils/StorageUtils";
import {notification, Table, Space, Pagination, Popconfirm, Switch, Form, Input, Select} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './AdvertListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {deleteAdvert, getAdvertChannelPage, getAdvertPage, setAdvertStatus} from "../../api/AdvertAdminApi";
import AdvertEdit from "./AdvertEdit";
import {getChannelPage} from "../../api/ChannelAdminApi";


export default function AdvertListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const advertEdit=useRef();

    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,status:'',keyword:'',orgId:getOrgType()==0?'':getOrgId(),channelId:''});


    const [form] = Form.useForm();

    const [options, setOptions] = useState([]);



    useEffect(()=>{
        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page?filtersFromParams.page:request.page;
        const size=filtersFromParams.size?filtersFromParams.size:request.size;
        const status=filtersFromParams.status?filtersFromParams.status:request.status;
        const keyword=filtersFromParams.keyword?filtersFromParams.keyword:request.keyword;
        const channelId=filtersFromParams.channelId?filtersFromParams.channelId:request.channelId;
        request.page=page;
        request.size=size;
        request.status=status;
        request.keyword=keyword;
        request.channelId=channelId;

        form.setFieldsValue({
            'keyword':keyword,
            'channelId':channelId,
        });
        loadData();
        loadChannelList();
    },[]);


    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&status=${request.status}&keyword=${request.keyword}&channelId=${request.channelId}`);
    },[request]);




    const loadData=async ()=>{
        let {status,message,data}=await getAdvertPage(request);
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDeleteAdvert= async({id})=>{
        let {status,message}=await deleteAdvert({id:id});
        if(status==0){
            loadData({page:request.page,size:request.size});
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onSetAdvertStatus=async (params)=>{
        let {status,message}=await setAdvertStatus({id:params.id,status:params.status});
        if(status==0){
            loadData({page:request.page,size:request.size});
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const loadChannelList=async ()=>{
        let type=getOrgType()==0?'':1;
        let {status,message,data}=await getAdvertChannelPage({type:type,page:0,size:50});

        if(status!=0){
            notification.error({message:"系统提示",description:message});
            return;
        }
        const options = [];
        data.content.forEach((d)=>{
            options.push({
                value: d.id,
                label: d.title,
            });
        });
        setOptions(options);
    }

    const onPageChange=(page,pageSize)=>{
        request.page=page-1;
        request.size=pageSize;
        setRequest({...request});
        loadData();
    }

    const items = [
        {
            key: '',
            label: '全部',
        },
        {
            key:'0',
            label:'未上架',
        },
        {
            key:'1',
            label:'已上架',
        },
    ];


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '频道ID',
            dataIndex: 'channelId',
            key: 'channelId',
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '图片',
            dataIndex: 'image',
            key: 'image',
            render: (_, {image}) => (
                <img src={image} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
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
            render: (_, {id,status}) => (
                <Switch checked={status==1} checkedChildren="已上架" unCheckedChildren="未上架" onChange={(v)=>{
                   onSetAdvertStatus({id:id,status:v?1:0});
                }}/>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{
                        advertEdit.current.showModel({data:record})
                    }}>编辑</Button>
                    <Popconfirm
                        title="提示"
                        description="确定删除该条记录吗?"
                        onConfirm={()=>{onDeleteAdvert(record)}}
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
                <div className="filter">
                    <Form
                        form={form}
                        size="small"
                        name="control-hooks"
                        onFinish={(values)=>{
                            request.keyword=values.keyword?values.keyword:'';
                            request.channelId=values.channelId?values.channelId:'';
                            setRequest({...request});
                            loadData();
                        }}
                        style={{
                            maxWidth: 600,
                            display: 'flex',
                        }}
                    >

                        <Form.Item
                            label="频道"
                            name="channelId"
                            rules={[
                                {
                                    required: false,
                                    message: '请选择频道!',
                                },
                            ]}
                        >
                            <Select
                                style={{width:180}}
                                placeholder="请选择频道!"
                                options={options}
                                allowClear
                            >
                            </Select>
                        </Form.Item>

                        &nbsp;&nbsp;

                        <Form.Item
                            name="keyword"
                            label="关键字"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item >
                            <Space>
                                <Button type="primary" htmlType="submit" style={{marginLeft:8}}>
                                    筛选
                                </Button>
                                <Button htmlType="button" onClick={()=>{form.resetFields();}}>
                                    重置
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                <Button onClick={()=>{advertEdit.current.showModel({data:{}})}}>新增</Button>
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
            <AdvertEdit cref={advertEdit} onEditFinish={(r)=>{if(r)loadData()}}/>

        </>
    );

}