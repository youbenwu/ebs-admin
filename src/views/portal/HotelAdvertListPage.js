import React, {useState,useEffect,useRef} from "react"

import {getLocalOrg} from "../../utils/StorageUtils";
import {
    notification,
    Row,
    Table,
    Space,
    Pagination,
    Popconfirm,
    Switch,
    Form,
    Input,
    Select,
    Tabs,
    Tooltip
} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './AdvertListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {
    deleteAdvert,
    getAdvertChannelPage,
    getAdvertPage, getStatsAdvertStatus,
    setAdvertDisplay,
} from "../../api/AdvertAdminApi";
import AdvertEdit from "./AdvertEdit";
import AdvertStatusEdit from "./AdvertStatusEdit";


export default function HotelAdvertListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const advertEdit=useRef();
    const statusEdit=useRef();

    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,status:'',keyword:'',orgId:getLocalOrg().id,channelId:''});

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
        loadChannelList();
    },[]);


    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&status=${request.status}&keyword=${request.keyword}&channelId=${request.channelId}`);
        loadData().then();
        loadStats().then();
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

    const loadStats=async ()=>{
        let {status,data}=await getStatsAdvertStatus(request);
        console.log(data)
        if(status==0){
            let count=0;
            data.forEach(s=>{
                count+=s.count;
                let tab=tabs.find(t=>t.key===(s.status+''))
                if(tab){
                    tab.label=(tab.label.split('(')[0])+'('+s.count+')';
                }
            })
            tabs[0].label=(tabs[0].label.split('(')[0])+'('+count+')';
            setTabs([...tabs]);
            //console.log(tabs)
        }
    }

    const onDeleteAdvert= async({id})=>{
        let {status,message}=await deleteAdvert({id:id});
        if(status==0){
            loadData();
            loadStats();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onSetAdvertDisplay=async (params)=>{
        let {status,message}=await setAdvertDisplay({id:params.id,display:params.display});
        if(status==0){
            loadData();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const loadChannelList=async ()=>{
        let {status,message,data}=await getAdvertChannelPage({type:1,page:0,size:50});

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
    }

    //状态 0--正常 2--未审核 3--审核中 4--审核失败 7--过期
    const statsMap={
        0:"正常",
        2:"未审核",
        3:"审核中",
        4:"审核失败",
    };

    const statusView=(record)=>{
        return (statsMap[record.status]);
    }

    const [tabs, setTabs] = useState([
        {
            key: '',
            label: '全部',
        },
        {
            key:'0',
            label:'正常',
        },
        {
            key:'2',
            label:'未审核',
        },
        {
            key:'3',
            label:'审核中',
        },
        {
            key:'4',
            label:'审核失败',
        },
    ]);

    const onChange = (key) => {
        request.status=key;
        setRequest({...request});
    };

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
            ellipsis: {
                showTitle: false,
            },
            render: (title) => (
                <Tooltip placement="topLeft" title={title}>
                    {title}
                </Tooltip>
            ),
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
            title: '展示时间',
            dataIndex: 'times',
            key: 'times',
            render: (_, {startTime,endTime}) => (
                <>从{startTime}到{endTime}</>
            ),

        },
        {
            title: '状态',
            key: 'status',
            render: (_, record) => statusView(record),

        },
        {
            title: '上下架',
            dataIndex: 'display',
            key: 'display',
            render: (_, {id,display}) => (
                <Switch checked={display} checkedChildren="已上架" unCheckedChildren="未上架" onChange={(v)=>{
                   onSetAdvertDisplay({id:id,display:v?true:false});
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
                <Button onClick={()=>{advertEdit.current.showModel({data:{"type":3}})}}>新增</Button>
            </div>
            <Tabs type="card" activeKey={request.status} defaultActiveKey={request.status}  items={tabs} onChange={onChange} />
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