import {useState,useEffect,useRef} from "react"
import {notification, Table, Space, Pagination, Tabs, Form, Input, Popconfirm} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './HotelRoomTypeListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {deleteHotelRoomType, getHotelRoomTypePage} from "../../api/HotelAdminApi";
import {getLocalHotel} from "../../utils/StorageUtils";
import HotelRoomTypeEdit from "./HotelRoomTypeEdit";


export default function HotelRoomTypeListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const typeEdit=useRef();
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

        let {status,message,data}=await getHotelRoomTypePage({...request,hotelId:getLocalHotel()?.id,sort:"updateTime,desc"});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDeleteType=async ({id})=>{
        let {status,message}=await deleteHotelRoomType({id:id});
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
            title: '房型名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '房型简介',
            dataIndex: 'intro',
            key: 'intro',
            render: (_, {intro}) => (
                <div className="list-intro">{intro}</div>
            ),
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '可住人数',
            dataIndex: 'num',
            key: 'num',
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
                        typeEdit.current.showModel({data:record})
                    }}>编辑</Button>
                    <Popconfirm
                        title="提示"
                        description="确定删除该条记录吗?"
                        onConfirm={()=>{onDeleteType(record)}}
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

                <Button onClick={()=>{typeEdit.current.showModel({data:{}})}}>新增</Button>
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
            <HotelRoomTypeEdit cref={typeEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
        </>
    );

}