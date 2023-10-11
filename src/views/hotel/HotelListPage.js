import {useState,useEffect,useRef} from "react"
import {notification,Table,Space,Pagination,Tabs,Form,Input} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './HotelListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {getHotelPage} from "../../api/HotelAdminApi";
import HotelEdit from "./HotelEdit";
import HotelStatusEdit from "./HotelStatusEdit";


export default function HotelListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const hotelEdit=useRef();
    const statusEdit=useRef();
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,status:'',keyword:''});


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
        0:"正常",
        1:"禁用",
        2:"未审核",
        5:"审核失败",
        7:"欠费",
    };


    const loadData=async ()=>{
        let {status,message,data}=await getHotelPage({...request,sort:"updateTime,desc"});
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
    const items = [
        {
            key: '',
            label: '全部',
        },
        {
            key:'0',
            label:'正常',
        },
        {
            key:'1',
            label:'禁用',
        },
        {
            key:'2',
            label:'未审核',
        },
        {
            key:'5',
            label:'审核失败',
        },
        {
            key:'7',
            label:'欠费',
        },
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '简介',
            dataIndex: 'intro',
            key: 'intro',
            width: 200,
            render: (_, {intro}) => (
                <div className="list-intro">{intro}</div>
            ),
        },
        {
            title: '封面',
            dataIndex: 'image',
            key: 'image',
            render: (_, {image}) => (
                <img src={image} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '联系人',
            dataIndex: 'contact.name',
            key: 'contact.name',
            render: (_, {contact:{name}}) => (
                <>{name}</>
            ),
        },
        {
            title: '联系人手机',
            dataIndex: 'contact.phone',
            key: 'contact.phone',
            render: (_, {contact:{phone}}) => (
                <>{phone}</>
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
            render: (_, {id,status,statusRemark}) => (
                <>{statusRemark?statusRemark:statusMap[status]}</>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{
                        hotelEdit.current.showModel({data:record})
                    }}>编辑</Button>
                    <Button size="small" onClick={()=>{
                        statusEdit.current.showModel({data:record})
                    }}>审核</Button>
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

                <Button onClick={()=>{navigate("/hotel/register");}}>注册酒店</Button>
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
            <HotelEdit cref={hotelEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
            <HotelStatusEdit cref={statusEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
        </>
    );

}