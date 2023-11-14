import React,{useEffect,useState} from 'react';
import {useNavigate,Outlet,useLocation} from 'react-router-dom'
import {notification} from 'antd'
import "./MainPage.scss"
import { createFromIconfontCN ,MenuUnfoldOutlined,MenuFoldOutlined} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import {getMenuList} from "../../api/MenuApi";



const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4273593_485wtlr0vzy.js', // 在 iconfont.cn 上生成
});
const { Header, Sider, Content } = Layout;


export default function MainPage(){

    const navigate=useNavigate();
    const location=useLocation();

    useEffect(()=>{
        if(!localStorage.getItem("user")){
            navigate('/login');
        }
        loadMenus();
    },[]);

    //菜单从后台获取
    const [menus,setMenus]=useState([]);


    const icons={
        '/home':<MyIcon type="icon-home"/>,
        '/user':<MyIcon type="icon-user"/>,
        '/mall/order':<MyIcon type="icon-order"/>,
        '/hotel':<MyIcon type="icon-hotel"/>,
        '/org':<MyIcon type="icon-organization"/>,
        '/message':<MyIcon type="icon-message"/>,
        '/portal':<MyIcon type="icon-portal"/>,
        '/mall/product':<MyIcon type="icon-product"/>,
        '/mall/shop':<MyIcon type="icon-shop"/>,
    }

    const loadMenus = async () => {
        let {status,message,data}=await getMenuList({});
        if(status==0){
            data=conver(data);
            console.log(data);
            setMenus(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    };

    const conver=(data)=>{
        if(data==null)
            return data;
        data=data.map(r=>{
            return {
                //...r,
                key:r.path,
                label:r.name,
                icon:icons[r.path],
                children:conver(r.children)
            }
        });
        return data;
    }


    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onSelect=({key})=>{
        navigate(key);
    }
    const outLogin=()=>{
        localStorage.clear()
        navigate('/login');
    }
    return (

        <Layout className="layout" >
            <Sider trigger={null} collapsible collapsed={collapsed} className='sider'>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/home']}
                    selectedKeys={[location.pathname]}
                    items={menus}
                    onSelect={onSelect}
                />
            </Sider>
            <Layout className='page-r'>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:'center',
                        paddingRight:'20px',
                        width:'100%'
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Button onClick={outLogin}>退出登录</Button>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        // height: 'auto',
                        minHeight:'auto',
                        background: colorBgContainer,
                    }}
                >

                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    );


}