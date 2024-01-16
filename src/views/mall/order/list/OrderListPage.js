import React, {useState, useEffect, useRef} from "react"
import {notification, Table, Space, Tooltip, Switch, Tabs} from "antd";
import {Button} from 'antd'
import { createBrowserHistory } from "history";
import {useNavigate} from 'react-router-dom'
import qs from "qs";
import "./OrderListPage.scss"
import MyDeleteButton from "../../../../components/buttons/MyDeleteButton";
import {$deleteOrder, $getOrderPage, $getStatsOrderStatus} from "../../../../api/OrderAdminApi";
import {getLocalMerchant, getLocalOrg} from "../../../../utils/StorageUtils";

export default function OrderListPage () {


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
        setRequest({...request});
        //loadData().then();
    };

    /**
     *
     * 订单状态
     00 待付款：用户下单未付款状态
     10 待发货：用户付款商家未发货状态
     20 待签收：商家发货用户未签收状态
     30 已完成：用户签收交易完成状态
     40 已关闭：待付款超时、全额退款完成进入该状态
     *
     */
    const statsMap={
        0:"待付款",
        10:"待发货",
        20:"待签收",
        30:"已完成",
        40:"已关闭",
    };



    const getUserString=(order)=>{
        let u=order.user.realName??order.user.nickname;
        if(order.user.phone){
            u=u+" "+order.user.phone;
        }
        if(order.roomNo&&request.shopId){
            u=u+" 房间号："+order.roomNo;
        }
        return u;
    }

    const columns = [

        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '订单号',
            dataIndex: 'orderNo',
            key: 'orderNo',
        },
        {
            title: '商品图片',
            dataIndex: 'image',
            key: 'image',
            render: (_, {products}) => (
                <img src={products[0].productImage} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '商品描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: {
                showTitle: false,
            },
            render: (description) => (
                <Tooltip placement="topLeft" title={description}>
                    {description}
                </Tooltip>
            ),
        },
        {
            title: '订单金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: '下单用户',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => (
                getUserString(record)
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, {status,statusRemark}) => (
                (statusRemark??statsMap[status])
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{navigate("/mall/product/edit",{state:{id:record.id}})}}>编辑</Button>
                    <MyDeleteButton onConfirm={()=>{onDelete(record).then()}}/>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="header">
                <Button onClick={()=>{navigate("/mall/product/edit")}}>新增</Button>
            </div>
            <Tabs activeKey={request.status} defaultActiveKey={request.status}  items={tabs} onChange={onChange} />
            <Table
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