import {useState,useEffect} from "react"

import {notification, Table, Pagination} from "antd";
import {useNavigate} from 'react-router-dom'
import './UserListPage.scss'
import {createBrowserHistory} from "history";
import qs from "qs";
import {getUserPage} from "../../api/UserAdminApi";


export default function UserListPage () {


    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const history = createBrowserHistory();
    const [request,setRequest]=useState({page:0,size:10});


    useEffect(()=>{
        const filterParams = history.location.search.substr(1);
        const filtersFromParams = qs.parse(filterParams);
        const page=filtersFromParams.page?filtersFromParams.page:request.page;
        const size=filtersFromParams.size?filtersFromParams.size:request.size;
        request.page=page;
        request.size=size;
        loadData({page:page,size:size});

    },[]);

    useEffect(()=>{
        history.push(`?page=${request.page}&size=${request.size}`);
    },[request]);



    const loadData=async ({page,size})=>{
        let {status,message,data}=await getUserPage({page:page,size:size});
        console.log(data)
        if(status==0){
            setData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const onDeleteChannel=async ({id})=>{
        // let {status,message}=await deleteChannel({id:id});
        // if(status==0){
        //     loadData({page:request.page,size:request.size});
        // }else{
        //     notification.error({message:"系统提示",description:message});
        // }
    }

    const onPageChange=(page,pageSize)=>{
        setRequest({page:page-1,size:pageSize});
        loadData({page:page-1,size:pageSize});
    }


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '帐号',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (_, {avatar}) => (
                <img src={avatar} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '注册时间',
            dataIndex: 'registerTime',
            key: 'registerTime',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>正常</>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <></>
            ),
        },
    ];

    return (
        <>
            <div className="header">
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

        </>
    );

}