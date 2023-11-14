import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, {useState, useEffect, useRef} from "react"
import {notification, Table, Space, Button, Form, Input} from "antd";
import {deleteMenu, getMenuList, sortMenu} from "../../../api/MenuAdminApi";
import MyDeleteButton from "../../../components/buttons/MyDeleteButton";
import MenuEdit from "./MenuEdit";
import "./MenuListPage.scss"


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


export default function MenuListPage () {

    const [loading, setLoading] = useState(false);
    const [data,setData]=useState([]);
    const dataEdit=useRef();

    useEffect(()=>{
        loadData().then();
    },[]);

    const loadData=async ()=>{
        setLoading(true);
        let {status,message,data}=await getMenuList({});
        setLoading(false);
        //console.log(data)
        if(status===0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }



    const onDelete= async({id})=>{
        setLoading(true);
        let {status,message}=await deleteMenu({id:id});
        setLoading(false);
        if(status===0){
            //删除后重新加载数据
            await loadData();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onMove=async (data)=>{
        await sortMenu(data.map(t=>t.id))
        await loadData();
    }

    const statusMap={
        0:"显示",
        1:"隐藏",
    };

    const columns = [

        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '图标',
            key: 'icon',
            render: (_, {icon}) => (
                <img src={icon} style={{width:'25px',height:'25px'}}/>
            ),
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '状态',
            key: 'status',
            render: (_, {status}) => (
                <>{statusMap[status]}</>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{dataEdit.current.showModel(record)}}>编辑</Button>
                    <MyDeleteButton onConfirm={()=>onDelete(record)}/>
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
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={data.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        components={{
                            body: {
                                row: Row,
                            },
                        }}
                        rowKey="id"
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={false}
                        size="small"
                        scroll={{
                            y: 500,
                        }}
                    />
                </SortableContext>
            </DndContext>
            <MenuEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData().then()}} list={data}/>
        </>

    );

}