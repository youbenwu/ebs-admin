import {useState,useEffect,useRef} from "react"
import {notification, Table, Space, Pagination, Tabs, Form, Input, Popconfirm} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './HotelStayListPage.scss'
import {createBrowserHistory} from "history";
import moment from 'moment'
import qs from "qs";
import {
    deleteHotelRoom,
    deleteHotelRoomType, deleteHotelStay, deleteHotelWorkOrder,
    getHotelDevicePage,
    getHotelPage,
    getHotelRoomPage,
    getHotelRoomTypePage, getHotelStayPage, getHotelWorkOrderPage
} from "../../api/HotelAdminApi";
import HotelDeviceEdit from "./HotelDeviceEdit";
import {getTargetId} from "../../utils/StorageUtils";
import HotelRoomTypeEdit from "./HotelRoomTypeEdit";
import {deleteChannel} from "../../api/ChannelAdminApi";
import HotelEdit from "./HotelEdit";
import HotelStatusEdit from "./HotelStatusEdit";
import HotelRoomEdit from "./HotelRoomEdit";
import HotelRoomStatusEdit from "./HotelRoomStatusEdit";
import HotelWorkEdit from "./HotelWorkEdit";
import HotelWorkStatusEdit from "./HotelWorkStatusEdit";
import HotelStayEdit from "./HotelStayEdit";
import HotelStayStatusEdit from "./HotelStayStatusEdit";


export default function HotelStayListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const infoEdit=useRef();
    const statusEdit=useRef();
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,status:'',keyword:'',hotelId:getTargetId()});


    const [form] = Form.useForm();

    useEffect(()=>{
        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page?filtersFromParams.page:request.page;
        const size=filtersFromParams.size?filtersFromParams.size:request.size;
        const status=filtersFromParams.status?filtersFromParams.status:request.status;
        const keyword=filtersFromParams.keyword?filtersFromParams.keyword:request.keyword;
        request.page=page;
        request.size=size;
        request.status=status;
        request.keyword=keyword;

        form.setFieldsValue({
            'keyword':keyword,
        });
        loadData();

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&status=${request.status}&keyword=${request.keyword}`);
    },[request]);


    const statusMap={
        0:"未入住",
        1:"未结算",
        2:"已结算",
    };


    const loadData=async ()=>{
        let {status,message,data}=await getHotelStayPage({...request,sort:"updateTime,desc"});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDelete=async ({id})=>{
        let {status,message}=await deleteHotelStay({id:id});
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
        request.status=key;
        setRequest({...request});
        loadData();
    };
    const items = [
        {
            key: '',
            label: '全部',
        },
        {
            key:'1',
            label:'未结算',
        },
        {
            key:'2',
            label:'已结算',
        },
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        // {
        //     title: '酒店ID',
        //     dataIndex: 'hotelId',
        //     key: 'hotelId',
        // },
        {
            title: '房间号',
            dataIndex: 'roomNo',
            key: 'roomNo',
        },
        {
            title: '房间价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '客户名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '客户手机',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '入住时间',
            dataIndex: 'time',
            key: 'time',
            render: (_, {startTime,endTime}) => (
                <>{moment(new Date(startTime)).format("YYYY-MM-DD")}至{moment(new Date(endTime)).format("YYYY-MM-DD")}</>
            ),
        },
        {
            title: '入住天数',
            dataIndex: 'stayDays',
            key: 'stayDays',
        },
        {
            title: '押金',
            dataIndex: 'rents',
            key: 'rents',
        },
        {
            title: '消费金额',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, {status,statusRemark}) => (
                <>{statusRemark?statusRemark:statusMap[status]}</>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{
                        infoEdit.current.showModel({data:record})
                    }}>编辑</Button>
                    {record.status==1?(<Button size="small" onClick={()=>{
                        statusEdit.current.showModel({data:record})
                    }}>结算</Button>):(<></>)}
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
                }}>登记入住</Button>
            </div>
            <Tabs activeKey={request.status} defaultActiveKey={request.status}  items={items} onChange={onChange} />
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
            <HotelStayEdit cref={infoEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
            <HotelStayStatusEdit cref={statusEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
        </>
    );


}