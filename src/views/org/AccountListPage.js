import {useState, useEffect, useRef} from "react"
import {$getOrg, deleteAccount, getAccountPage} from "../../api/OrgAdminApi";
import {getOrgId, saveUser} from "../../utils/StorageUtils";
import {notification, Table, Space, Pagination, Popconfirm, Form, Input} from "antd";
import {Button} from 'antd'
import {useNavigate,useLocation} from 'react-router-dom'
import { createBrowserHistory } from "history";
import qs from "qs";
import RoleEdit from "./RoleEdit";
import AccountEdit from "./AccountEdit";
import {deleteAdvert} from "../../api/AdvertAdminApi";


export default function AccountListPage () {


    const history = createBrowserHistory();
    const navigate=useNavigate();
    const [request,setRequest]=useState({page:0,size:10,keyword:''});
    const [data,setData]=useState({});
    const accountEdit=useRef();

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
        history.push(`?page=${request.page}&size=${request.size}&keyword=${request.keyword}`);
    },[request]);

    const loadData=async ()=>{
        let orgId=getOrgId();
        let {status,message,data}=await getAccountPage({...request,orgId:orgId});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDeleteAccount= async({id})=>{
        let {status,message}=await deleteAccount({id:id});
        if(status==0){
            loadData({page:request.page,size:request.size});
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const getRoles=(a)=>{
        if(a.roles==null||a.roles.length==0)
            return '';
        var s='';
        a.roles.forEach(r=>{
            s=s+' '+r.role.title;
        });
        console.log(s)
        return s.trim();
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
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            render: (_, record) => (
                <>{getRoles(record)}</>
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
                    <Button size="small" type="primary" onClick={()=>{accountEdit.current.showModel({data:record})}}>编辑</Button>
                    <Popconfirm
                        title="提示"
                        description="确定删除该条记录吗?"
                        onConfirm={()=>{onDeleteAccount(record)}}
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

                <Button onClick={()=>{accountEdit.current.showModel({data:{}})}}>新增</Button>
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
            <AccountEdit cref={accountEdit} onEditFinish={(r)=>{if(r)loadData()}}/>
        </>
    );

}