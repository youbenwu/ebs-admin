import React, {useState,useEffect,useRef} from "react"

import {notification, Table, Space, Pagination, Form, Input, Tabs, Tooltip} from "antd";
import {Button} from 'antd'
import './CashListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {$deleteCash, $getCashPage, $getStatsCashStatusList} from "../../../api/CashAdminApi";
import {CashStatusEdit} from "./CashStatusEdit";
import MyDeleteButton from "../../../components/buttons/MyDeleteButton";


export default function CashListPage () {

    const [loading, setLoading] = useState(false);

    const [data,setData]=useState([]);

    const [tabs,setTabs]=useState([
        {
            key: '',
            label: '全部',
        },
        {
            key:'1',
            label:'待处理',
        },
        {
            key:'2',
            label:'已完成',
        },
        {
            key:'3',
            label:'已取消',
        },
    ]);

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



    },[]);


    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&status=${request.status}&keyword=${request.keyword}`);
        loadData().then();
        loadStats().then();
    },[request]);


    const loadData=async ()=>{
        let {status,message,data}=await $getCashPage(request);
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const loadStats=async ()=>{
        let {status,data}=await $getStatsCashStatusList({keyword:request.keyword});
        console.log(data)
        if(status==0){
           data.forEach(s=>{
               let tab=tabs.find(t=>t.key===(s.status+''))
               if(tab){
                   tab.label=(tab.label.split('(')[0])+'('+s.count+')';
               }
           })
            setTabs([...tabs]);
            console.log(tabs)
        }
    }

    const onDelete= async({id})=>{
        setLoading(true);
        let {status,message}=await $deleteCash({id:id});
        setLoading(false);
        if(status==0){
            loadData().then();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }


    const onPageChange=(page,pageSize)=>{
        request.page=page-1;
        request.size=pageSize;
        setRequest({...request});
    }

    const onChange = (key) => {
        request.status=key;
        setRequest({...request});
    };




    const columns = [
        // {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        {
            title: '订单号',
            dataIndex: 'orderNo',
            key: 'orderNo',
        },
        {
            title: '提现金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: '到帐金额',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '手续费',
            dataIndex: 'fee',
            key: 'fee',
        },
        {
            title: '支付宝帐号',
            dataIndex: 'alipayAccount',
            key: 'alipayAccount',
            width:"20%",
            render: (_, {alipayAccount}) => (
                alipayAccount.name+" "+alipayAccount.account
            ),
        },
        {
            title: '提交时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '状态',
            dataIndex: 'statusRemark',
            key: 'statusRemark',
        },
        {
            title: '外部状态',
            dataIndex: 'outStatusRemark',
            key: 'outStatusRemark',
            ellipsis: {
                showTitle: false,
            },
            render: (outStatusRemark) => (
                <Tooltip placement="topLeft" title={outStatusRemark}>
                    {outStatusRemark}
                </Tooltip>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status==1?(<Button size="small" type="primary" onClick={()=>{
                    statusEdit.current.showModel(record)
                }}>审核</Button>):(<></>)}
                    {record.status==0||record.status==3?(<MyDeleteButton onConfirm={()=>{onDelete(record).then()}}/>):(<></>)}

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
            <Tabs activeKey={request.status} defaultActiveKey={request.status}  items={tabs} onChange={onChange} />
            <Table columns={columns} dataSource={data.content} pagination={false} loading={loading}/>
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
            <CashStatusEdit cref={statusEdit} onEditFinish={(r)=>{if(r)loadData().then()}}/>
        </>
    );

}