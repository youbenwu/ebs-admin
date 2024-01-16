import React, {useRef, useState,useEffect} from 'react';
import './LoginPage.scss'
import { Spin,Button, Checkbox, Form, Input,notification,Space } from 'antd';
import {useNavigate} from 'react-router-dom'
import {$login} from "../../api/UserApi";
import SelectSys from "./SelectSys";
import {$getSysBySysNo} from "../../api/SysApi";
import {$getOrgList} from "../../api/OrgApi";
import {saveLocalHotel, saveLocalMerchant, saveLocalOrg, saveLocalSys, saveLocalUser} from "../../utils/StorageUtils";
import {$getHotelByOrg} from "../../api/HotelApi";
import {$getMerchant, $getMerchantByOrg} from "../../api/MerchantApi";

export default function LoginPage(){
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const selectSys=useRef();

    const [sys, setSys] = useState();

    useEffect(()=>{
        loadSys().then();
    },[])

    const  loadSys=async ()=>{
        const domainPrefix = window.location.hostname.split('.')[0];
        let {data}=await $getSysBySysNo({sysNo:domainPrefix});
        if(data) {
            saveLocalSys(data);
            setSys(data);
        }else{
            notification.error({message:"系统提示",description:"系统繁忙，请稍候再试！"});
        }
    }

    const goHome=()=>{
        navigate("/home");
    }

    const onFinish =async (values) => {
        console.log('Success:', values);
        setLoading(true)
        let {status,message,data}=await $login(values);
        setLoading(false)

        if(status!==0){
            notification.info({message:"系统提示",description:message});
            return;
        }

        saveLocalUser(data);

        await loadOrgList();

    };

    const loadOrgList=async ()=>{
        setLoading(true)
        let {status,message,data}=await $getOrgList({type:sys.type});
        setLoading(false)

        if(status!==0){
            notification.info({message:"系统提示",description:message});
            return;
        }

        if(data.length==0){
            notification.error({message:"系统提示",description:"您不是管理员！"});
            return;
        }

        if(data.length==1){
            await loginOrg(data[0]);
        }else{
            selectSys.current.showModel(data);
        }

    }


    const loginOrg=async (org)=>{
        saveLocalOrg(org);
        if(sys.type===6){
           let hotel=await loadHotelData({orgId:org.id});
           if(!hotel)return;
           let merchant=await loadMerchantData({id:hotel.merchantId});
           if(!merchant)return;
        }else if(sys.type===3){
           let merchant=await loadMerchantDataByOrgId({orgId:org.id});
           if(!merchant)return;
        }else{

        }
        goHome();
    }

    // const isType=(org,type)=>{
    //     if(org.type===type)
    //         return true;
    //     if(org.types){
    //         for (let t in org.types){
    //             if(t.type===type)
    //                 return true;
    //         }
    //     }
    //     return false;
    // }

    const loadHotelData=async ({orgId})=>{
        let {data}=await $getHotelByOrg({orgId:orgId});
        if(data) {
            saveLocalHotel(data);
        }else{
            notification.info({message:"系统提示",description:"系统繁忙，请稍候再试！"});
        }
        return data;
    }

    const loadMerchantDataByOrgId=async ({orgId})=>{
        let {data}=await $getMerchantByOrg({orgId:orgId});
        if(data){
            saveLocalMerchant(data);
        }else{
            notification.info({message:"系统提示",description:"系统繁忙，请稍候再试！"});
        }
        return data;

    }

    const loadMerchantData=async ({id})=>{
        let {data}=await $getMerchant({id:id});
        if(data){
            saveLocalMerchant(data);
        }else{
            notification.info({message:"系统提示",description:"系统繁忙，请稍候再试！"});
        }
        return data;
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    const spin=(
        <Spin/>
    );

    const registerHotel=(
        <Button type="link" onClick={()=>{
            navigate("/hotel/register");
        }}>注册酒店</Button>
    );

    const login=(
        <div className='login'>
            <SelectSys cref={selectSys} onSelected={(org)=>loginOrg(org)}/>
            <h2>{sys?.name}</h2>
            <Form
                form={form}
                name="login"
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 18,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="账号"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的账号!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的密码!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 4,
                        span: 16,
                    }}
                >
                    <Checkbox>记住我</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 4,
                        span: 16,
                    }}
                >
                    <Space>
                        <Button  type="primary" htmlType="submit">
                            登陆
                        </Button>
                        <Button  htmlType="button" onClick={onReset}>
                            重置
                        </Button>
                    </Space>
                </Form.Item>

            </Form>
        </div>
    );

    return (
        <div className='content'>
            {sys?login:spin}
        </div>
    );


}