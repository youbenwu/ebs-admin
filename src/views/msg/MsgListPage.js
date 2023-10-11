import {useState,useEffect} from "react"
import {notification, Table, Space, Pagination, Form, Input, Popconfirm} from "antd";
import {Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import './MsgListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {deleteMessage, getMessagePage} from "../../api/MessageAdminApi";
import {deleteAdvert} from "../../api/AdvertAdminApi";
import {getOrgId, getOrgType} from "../../utils/StorageUtils";


export default function MsgListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,keyword:'',orgId:getOrgType()==0?"":getOrgId()});


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
        let {status,message,data}=await getMessagePage({...request,sort:"updateTime,desc"});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDeleteMessage=async ({id})=>{
        let {status,message}=await deleteMessage({id:id});
        if(status==0){
            loadData({page:request.page,size:request.size});
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




    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '消息标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '消息内容',
            dataIndex: 'content',
            key: 'content',
            width: 200,
            render: (_, {content}) => (
                <div className="list-intro">{content}</div>
            ),
        },
        {
            title: '消息图片',
            dataIndex: 'image',
            key: 'image',
            render: (_, {image}) => (
                <img src={image} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '发送人',
            dataIndex: 'from.nickname',
            key: 'from.nickname',
            render: (_, {from:{nickname}}) => (
                <>{nickname}</>
            ),
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: '状态',
            dataIndex: 'statusRemark',
            key: 'statusRemark',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="提示"
                        description="确定删除该条记录吗?"
                        onConfirm={()=>{onDeleteMessage(record)}}
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

                <Button onClick={()=>{navigate("/message/send");}}>发送消息</Button>
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
        </>
    );

}