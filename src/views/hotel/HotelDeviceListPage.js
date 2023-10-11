import {useState,useEffect,useRef} from "react"
import {notification,Table,Space,Pagination,Tabs,Form,Input} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './HotelDeviceListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {getHotelDevicePage} from "../../api/HotelAdminApi";
import HotelDeviceEdit from "./HotelDeviceEdit";
import {getTargetId} from "../../utils/StorageUtils";


export default function HotelDeviceListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const hotelDeviceEdit=useRef();
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,keyword:''});


    const [form] = Form.useForm();

    useEffect(()=>{
        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page?filtersFromParams.page:request.page;
        const size=filtersFromParams.size?filtersFromParams.size:request.size;
        const keyword=filtersFromParams.keyword?filtersFromParams.keyword:request.keyword;
        request.page=page;
        request.size=size;
        request.keyword=keyword;

        form.setFieldsValue({
            'keyword':keyword,
        });
        loadData();

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&keyword=${request.keyword}`);
    },[request]);




    const loadData=async ()=>{
        var hotelId=getTargetId();
        let {status,message,data}=await getHotelDevicePage({...request,hotelId:hotelId?hotelId:'',sort:"updateTime,desc"});
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


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '酒店ID',
            dataIndex: 'hotelId',
            key: 'hotelId',
        },
        {
            title: '房间号',
            dataIndex: 'roomNo',
            key: 'roomNo',
        },
        {
            title: '设备号',
            dataIndex: 'deviceNo',
            key: 'deviceNo',
        },
        {
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '设备型号',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: '应用类型',
            dataIndex: 'appType',
            key: 'appType',
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
                        hotelDeviceEdit.current.showModel({data:record})
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
            <HotelDeviceEdit cref={hotelDeviceEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
        </>
    );

}