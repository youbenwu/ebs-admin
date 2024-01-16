import React, {useState,useEffect,useRef} from "react"
import {notification, Table, Space, Form, Tooltip, Tabs} from "antd/es/index";
import {Button} from 'antd/es/index'
import './SpCategoryListPage.scss'
import {CSS} from "@dnd-kit/utilities";
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SpCategoryEdit from "./SpCategoryEdit";
import {deleteSpCategory, getSpCategoryList, sortSpCategory} from "../../../api/ShopAdminApi";
import {getLocalMerchant, getLocalOrg} from "../../../utils/StorageUtils";
import MyDeleteButton from "../../../components/buttons/MyDeleteButton";
import {getProductTypeList} from "../../../api/ProductTypeAdminApi";


const Row = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && {
                ...transform,
                scaleY: 1,
            },
        ),
        transition,
        cursor: 'move',
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };
    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};



export default function SpCategoryListPage () {

    const dataEdit=useRef();
    const [loading, setLoading] = useState(false);
    const [data,setData]=useState([]);

    const [tabs, setTabs] = useState([]);

    const [request,setRequest]=useState(
        {
            productType: '',
            shopId:getLocalMerchant().shopId,
        }
    );

    useEffect(()=>{
        loadTypesData().then();
    },[]);

    useEffect(()=>{
        loadData().then();
    },[request]);



    const loadData=async ()=>{
        setLoading(true);
        let {status,message,data}=await getSpCategoryList(request);
        setLoading(false);
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const loadTypesData= async ()=>{
        let {status,data}=await getProductTypeList({});
        if(status===0){
            data=data.map(t=>{
                return {
                    ...t,
                    key:t.type,
                    label:t.name,
                }
            });
            setTabs([
                {
                    key:'',
                    label:'全部',
                },
                ...data
            ]);
        }
    }


    const onDelete= async({id})=>{
        setLoading(true);
        let {status,message}=await deleteSpCategory({id:id});
        setLoading(false);
        if(status==0){
            loadData().then();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }


    const onChange = (key) => {
        request.productType=key;
        setRequest({...request});
    };


    const onMove=async (data)=>{
        await sortSpCategory(data.map(t=>t.id))
        await loadData();
    }


    const columns = [
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '图片',
            key: 'image',
            render: (_, {image}) => (
                <img src={image} style={{width:'25px',height:'25px'}}/>
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
            title: '商品类型',
            dataIndex: 'productType',
            key: 'productType',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
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
                    <Button
                        size="small"
                        type="primary"
                        onClick={()=>{dataEdit.current.showModel(record)}}
                    >编辑</Button>
                    <MyDeleteButton
                        onConfirm={()=>{onDelete(record).then()}}
                    />
                </Space>
            ),
        },

    ];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
                distance: 1,
            },
        }),
    );
    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setData((prev) => {
                const activeIndex = prev.findIndex((i) => i.id === active.id);
                const overIndex = prev.findIndex((i) => i.id === over?.id);
                if(activeIndex!==-1&&overIndex!==-1) {
                    prev = arrayMove(prev, activeIndex, overIndex);
                    onMove(prev).then();
                }
                return prev;
            });
        }
    };

    return (
        <>
            <div className="header">
                <Button onClick={()=>{dataEdit.current.showModel({})}}>新增</Button>
            </div>
            <Tabs type="card" activeKey={request.productType} defaultActiveKey={request.productType}  items={tabs} onChange={onChange} />
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={false}
                loading={loading}
                size="small"
                scroll={{
                    y: 500,
                }}
            />
            <SpCategoryEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData().then()}} list={data}/>
        </>
    );

}