import React, {useState, useEffect, useRef} from "react"
import {notification,Row,Col, Table, Space, Tooltip, Switch, Tabs} from "antd";
import {Button} from 'antd'
import { createBrowserHistory } from "history";
import {useNavigate} from 'react-router-dom'
import qs from "qs";
import "./OrderListPage2.scss"
import {$deleteOrder, $getOrderPage, $getStatsOrderStatus} from "../../../../api/OrderAdminApi";
import {getLocalMerchant, getLocalOrg} from "../../../../utils/StorageUtils";
import OrderRow from "./OrderRow";

export default function OrderListPage2 () {


    const navigate=useNavigate();
    const [loading, setLoading] = useState(false);
    const history = createBrowserHistory();
    const [tabs, setTabs] = useState([
        {
            key: '',
            label: '全部',
        },
        {
            key:'0',
            label:'待付款',
        },
        {
            key:'10',
            label:'待发货',
        },
        {
            key:'20',
            label:'待签收',
        },
        {
            key:'30',
            label:'已完成',
        },
        {
            key:'40',
            label:'已关闭',
        },
    ]);
    const [request,setRequest]=useState({
        page:0,
        size:10,
        status:'',
        shopId:getLocalOrg().type==0?null:getLocalMerchant().shopId}
        );
    const [data,setData]=useState({});

    useEffect(()=>{

        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page??0;
        const size=filtersFromParams.size??10;
        request.page=page;
        request.size=size;

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&status=${request.status}`);
        loadData().then();
        loadStats().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[request]);

    const loadData=async ()=>{
        setLoading(true);
        let {status,message,data}=await $getOrderPage(request);
        setLoading(false);
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const loadStats=async ()=>{
        let {status,data}=await $getStatsOrderStatus(request);
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

    const onDelete= async({id})=>{
        setLoading(true);
        let {status,message}=await $deleteOrder({id:id});
        setLoading(false);
        if(status==0){
            loadData().then();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }


    const onTableChange = (pagination, filters, sorter) => {

        setRequest(
            {
                ...request,
                page:pagination.current-1,
                size:pagination.pageSize,
            }
        );

        if (request.page !== data.pageable?.pageNumber) {
            setData({});
        }

    };

    const onChange = (key) => {
        request.status=key;
        request.page=0;
        setRequest({...request});
    };


    const table_title=(
        <Row style={{width:'100%',textAlign:'center'}}>
            <Col span={8}>
                <div>宝贝</div>
            </Col>
            <Col span={2}>
                <div>单价（元）</div>
            </Col>
            <Col span={2}>
                <div>数量</div>
            </Col>
            <Col span={4}>
                <div>买家</div>
            </Col>
            <Col span={4}>
                <div>交易状态</div>
            </Col>
            <Col span={4}>
                <div>实收款</div>
            </Col>
        </Row>
    );

    const columns = [

        {
            title: table_title,
            key: 'row',
            render: (_, record) => (
                <OrderRow order={record} onChanged={()=>{setRequest({...request})}}/>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };

    return (
        <>
            <div className="header">
            </div>
            <Tabs
                type="card"
                activeKey={request.status}
                defaultActiveKey={request.status}
                items={tabs} onChange={onChange}
            />
            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                columns={columns}
                rowKey="id"
                dataSource={data.content}

                pagination= {{
                    current: request.page+1,
                    pageSize: request.size,
                    total:data.totalElements,
                }}
                onChange={onTableChange}
                loading={loading}
                size="small"
                scroll={{
                    y: 500,
                }}
            />

        </>
    );

}