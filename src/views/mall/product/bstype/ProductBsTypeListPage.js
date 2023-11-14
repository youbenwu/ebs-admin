import React,{useState,useEffect,useRef} from "react"
import {notification, Table, Space} from "antd/es/index";
import {Button} from 'antd/es/index'
import {deleteProductBsType, getProductBsTypeList} from "../../../../api/ProductAdminApi";
import MyDeleteButton from "../../../../components/buttons/MyDeleteButton";
import ProductBsTypeEdit from "./ProductBsTypeEdit";


export default function ProductBsTypeListPage () {

    const [loading, setLoading] = useState(false);
    const [data,setData]=useState([]);
    const dataEdit=useRef();

    useEffect(()=>{
        loadData().then();
    },[]);


    const loadData=async ()=>{
        setLoading(true)
        let {status,message,data}=await getProductBsTypeList({});
        setLoading(false)
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDelete=async ({type})=>{
        setLoading(true)
        let {status,message}=await deleteProductBsType({type:type});
        setLoading(false)
        if(status==0){
            loadData().then();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }


    const columns = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '描述',
            dataIndex: 'describe',
            key: 'describe',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{dataEdit.current.showModel(record)}}>编辑</Button>
                    <MyDeleteButton onConfirm={()=>{onDelete(record)}}/>
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
                rowKey="type"
                columns={columns}
                dataSource={data}
                pagination={false}
                loading={loading}
            />
            <ProductBsTypeEdit cref={dataEdit} onEditFinish={(r)=>{if(r)loadData().then()}}/>
        </>
    );

}