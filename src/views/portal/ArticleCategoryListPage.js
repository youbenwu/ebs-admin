import React, {useState,useEffect,useRef} from "react"
import {notification, Table, Space, Tooltip} from "antd/es/index";
import {Button} from 'antd/es/index'
import ArticleCategoryEdit from "./ArticleCategoryEdit";
import {deleteArticleCategory, getArticleCategoryList} from "../../api/ArticleAdminApi";
import MyDeleteButton from "../../components/buttons/MyDeleteButton";


export default function ArticleCategoryListPage () {

    const dataEdit=useRef();
    const [loading, setLoading] = useState(false);
    const [data,setData]=useState([]);

    useEffect(()=>{
        loadData().then();

    },[]);



    const loadData=async ()=>{
        setLoading(true);
        let {status,message,data}=await getArticleCategoryList({});
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
        let {status,message}=await deleteArticleCategory({id:id});
        setLoading(false);
        if(status==0){
            loadData().then();
        }else{
            notification.error({message:"系统提示",description:message});
        }
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


    return (
        <>
            <div className="header">
                <Button onClick={()=>{dataEdit.current.showModel({})}}>新增</Button>
            </div>
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
            <ArticleCategoryEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData().then()}} list={data}/>
        </>
    );

}