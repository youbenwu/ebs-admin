import {useState,useEffect,useRef} from "react"
import {notification,Table,Space,Pagination,Tabs,Form,Input} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './DataStatsListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {getDataStatsPage} from "../../api/DataStatsAdminApi";
import DataStatsEdit from "./DataStatsEdit";


export default function DataStatsListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const dataEdit=useRef();
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,channel:'',keyword:''});


    const [form] = Form.useForm();

    useEffect(()=>{
        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page?filtersFromParams.page:request.page;
        const size=filtersFromParams.size?filtersFromParams.size:request.size;
        const channel=filtersFromParams.channel?filtersFromParams.channel:request.channel;
        const keyword=filtersFromParams.keyword?filtersFromParams.keyword:request.keyword;
        request.page=page;
        request.size=size;
        request.channel=channel;
        request.keyword=keyword;

        form.setFieldsValue({
            'keyword':keyword,
        });
        loadData();

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&channel=${request.channel}&keyword=${request.keyword}`);
    },[request]);







    const loadData=async ()=>{
        let {status,message,data}=await getDataStatsPage({...request});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onPageChange=(page,pageSize)=>{
        request.page=page-1;
        request.size=pageSize;
        setRequest({...request});
        loadData();
    }


    const onChange = (key) => {
        request.status=key;
        setRequest({...request});
        loadData();
    };


    const channelMap={
        "ticket-order-amount-stats":"门票订单金额统计",
        "ticket-order-count-stats":"门票订单数量统计",
        "user-stats":"用户相关统计",
        "hotel-device-stats":"酒店设备统计",
    };

    const channels=[
        {
            key: 'ticket-order-amount-stats',
            label: '门票订单金额统计',
        },
        {
            key:'ticket-order-count-stats',
            label:'门票订单数量统计',
        },
        {
            key:'user-stats',
            label:'用户相关统计',
        },
        {
            key:'hotel-device-stats',
            label:'酒店设备统计',
        }
    ]



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '分组',
            dataIndex: 'channel',
            key: 'channel',
        },
        {
            title: '显示值',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '真实值',
            dataIndex: 'realValue',
            key: 'realValue',
        },
        {
            title: '显示后缀',
            dataIndex: 'suffix',
            key: 'suffix',
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
                        dataEdit.current.showModel({data:record})
                    }}>编辑</Button>
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
                            setRequest({...request});
                            loadData();
                        }}
                        style={{
                            maxWidth: 600,
                            display: 'flex',
                        }}
                    >
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

                <Button onClick={()=>{
                    dataEdit.current.showModel({data:{}})
                }}>新增</Button>
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
            <DataStatsEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
        </>
    );

}