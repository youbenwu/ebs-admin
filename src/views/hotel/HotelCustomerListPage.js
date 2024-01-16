import {useState,useEffect,useRef} from "react"
import {notification, Table, Space, Pagination, Tabs, Form, Input, Popconfirm} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './HotelCustomerListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {
    deleteHotelCustomer,getHotelCustomerPage,
} from "../../api/HotelAdminApi";
import {getLocalHotel} from "../../utils/StorageUtils";
import HotelCustomerEdit from "./HotelCustomerEdit";


export default function HotelCustomerListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const infoEdit=useRef();
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,stayStatus:'',keyword:'',hotelId:getLocalHotel()?.id});


    const [form] = Form.useForm();

    useEffect(()=>{
        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page?filtersFromParams.page:request.page;
        const size=filtersFromParams.size?filtersFromParams.size:request.size;
        const stayStatus=filtersFromParams.stayStatus?filtersFromParams.stayStatus:request.stayStatus;
        const keyword=filtersFromParams.keyword?filtersFromParams.keyword:request.keyword;
        request.page=page;
        request.size=size;
        request.stayStatus=stayStatus;
        request.keyword=keyword;

        form.setFieldsValue({
            'keyword':keyword,
        });
        loadData();

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&stayStatus=${request.stayStatus}&keyword=${request.keyword}`);
    },[request]);


    const statusMap={
        0:"未入住",
        1:"已入住",
    };


    const loadData=async ()=>{
        let {status,message,data}=await getHotelCustomerPage({...request,sort:"updateTime,desc"});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDelete=async ({id})=>{
        let {status,message}=await deleteHotelCustomer({id:id});
        if(status==0){
            loadData();
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
        request.stayStatus=key;
        setRequest({...request});
        loadData();
    };
    const items = [
        {
            key: '',
            label: '全部',
        },
        {
            key:'0',
            label:'未入住',
        },
        {
            key:'1',
            label:'已入住',
        },

    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: '酒店ID',
            dataIndex: 'hotelId',
            key: 'hotelId',
        },
        {
            title: '客户姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '客户手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '入住次数',
            dataIndex: 'stays',
            key: 'stays',
        },
        {
            title: '入住天数',
            dataIndex: 'stayDays',
            key: 'stayDays',
        },
        {
            title: '消费金额',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '状态',
            dataIndex: 'stayStatus',
            key: 'stayStatus',
            render: (_, {stayStatus}) => (
                <>{statusMap[stayStatus]}</>
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
                    <Button size="small" type="primary" onClick={()=>{
                        infoEdit.current.showModel({data:record})
                    }}>编辑</Button>
                    <Popconfirm
                        title="提示"
                        description="确定删除该条记录吗?"
                        onConfirm={()=>{onDelete(record)}}
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
                    infoEdit.current.showModel({data:{}})
                }}>增加</Button>
            </div>
            <Tabs activeKey={request.stayStatus} defaultActiveKey={request.stayStatus}  items={items} onChange={onChange} />
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
            <HotelCustomerEdit cref={infoEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
        </>
    );


}