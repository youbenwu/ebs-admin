import React, {useState, useEffect, useRef} from "react"
import {notification, Table, Space, Tooltip, Switch} from "antd";
import {Button} from 'antd'
import { createBrowserHistory } from "history";
import {useNavigate} from 'react-router-dom'
import qs from "qs";
import {deleteArticle, getArticlePage} from "../../api/ArticleAdminApi";
import MyDeleteButton from "../../components/buttons/MyDeleteButton";

export default function ArticleListPage () {


    const navigate=useNavigate();
    const [loading, setLoading] = useState(false);
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10});
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
        history.push(`?page=${request.page}&size=${request.size}`);
        loadData().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[request]);

    const loadData=async ()=>{
        setLoading(true);
        let {status,message,data}=await getArticlePage(request);
        setLoading(false);
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDelete= async({id})=>{
        setLoading(true);
        let {status,message}=await deleteArticle({id:id});
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

    /**
     *
     * 状态(0--正常 1--禁用 2--未审核 3--审核中 4--审核失败)
     *
     */
    const statsMap={
        0:"正常",
        1:"禁用",
        2:"未审核",
        3:"审核中",
        4:"审核失败",
    };

    const columns = [

        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: {
                showTitle: false,
            },
            render: (title) => (
                <Tooltip placement="topLeft" title={title}>
                    {title}
                </Tooltip>
            ),
        },
        {
            title: '分类',
            dataIndex: 'categoryTitle',
            key: 'categoryTitle',
            ellipsis: {
                showTitle: false,
            },
            render: (subtitle) => (
                <Tooltip placement="topLeft" title={subtitle}>
                    {subtitle}
                </Tooltip>
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
            render: (_, {status,statusRemark}) => (
                (statusRemark??statsMap[status])
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{navigate("/portal/article/edit",{state:{id:record.id}})}}>编辑</Button>
                    <MyDeleteButton onConfirm={()=>{onDelete(record).then()}}/>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="header">
                <Button onClick={()=>{navigate("/portal/article/edit")}}>新增</Button>
            </div>
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