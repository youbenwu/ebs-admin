import React, {useState, useEffect, useRef} from "react"
import {notification, Table, Space,Tooltip} from "antd";
import {Button} from 'antd'
import { createBrowserHistory } from "history";
import qs from "qs";
import "./ProductTypeListPage.scss"
import {deleteProductType, getProductTypePage} from "../../../../api/ProductTypeAdminApi";
import ProductTypeEdit from "./ProductTypeEdit";
import MyDeleteButton from "../../../../components/buttons/MyDeleteButton";
import {getProductBsTypeList, getProductTypeEnum} from "../../../../api/ProductAdminApi";
import TableKeywordFilterView from "../../../common/TableKeywordFilterView";

export default function ProductTypeListPage () {


    const [loading, setLoading] = useState(false);
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10,keyword:''});
    const [data,setData]=useState({});
    const [bstypeMap,setBstypeMap]=useState({});


    const dataEdit=useRef();

    useEffect(()=>{

        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page??0;
        const size=filtersFromParams.size??10;
        const keyword=filtersFromParams.keyword??'';
        request.page=page;
        request.size=size;
        request.keyword=keyword;
        loadBsTypeData().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}&keyword=${request.keyword}`);
        loadData().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[request]);

    const loadData=async ()=>{
        setLoading(true);
        let {status,message,data}=await getProductTypePage(request);
        setLoading(false);
        console.log(data)
        if(status===0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const loadBsTypeData=async ()=>{
        let {status,data}=await getProductTypeEnum({});
        if(status===0){
            let map=new Map();
            data.forEach(t=>{
                map.set(t.type,t.describe);
            })
            setBstypeMap(map);
        }
    }

    const onDelete= async({id})=>{
        setLoading(true);
        let {status,message}=await deleteProductType({id:id});
        setLoading(false);
        if(status===0){
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
            ellipsis: {
                showTitle: false,
            },
            render: (name) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            ),
        },
        {
            title: '描述',
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
            title: '业务类型',
            key: 'type',
            render: (_, {type}) => (
                (bstypeMap.get(type)??type)
            ),
        },
        {
            title: '属性',
            key: 'propertyCount',
            render: (_, {propertys}) => (
                (propertys?.length??0)
            ),
        },
        {
            title: '参数',
            key: 'attributeCount',
            render: (_, {attributes}) => (
                (attributes?.length??0)
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
                    <Button size="small" type="primary" onClick={()=>{dataEdit.current.showModel(record)}}>编辑</Button>
                    <MyDeleteButton onConfirm={()=>{onDelete(record).then()}}/>
                </Space>
            ),
        },
    ];



    return (
        <>
            <div className="header">
                <div className="filter">
                    <TableKeywordFilterView keyword={request.keyword} onSearch={(s)=>{
                        setRequest({
                            ...request,
                            page:0,
                            keyword:s,
                        });
                    }}/>
                </div>
                <Button onClick={()=>{dataEdit.current.showModel({})}}>新增</Button>
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
           <ProductTypeEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData().then()}}/>
        </>
    );

}