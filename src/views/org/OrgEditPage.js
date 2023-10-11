import React, {useState,useEffect} from "react"
import {$getOrg, $saveOrg} from "../../api/OrgAdminApi";
import {Checkbox, Form, Input, notification, Space} from "antd";
import {Button} from 'antd'
import {getOrgId, saveUser} from "../../utils/StorageUtils";
import {useNavigate} from 'react-router-dom'
import {$login} from "../../api/UserApi";

export default function OrgEditPage () {

    const navigate=useNavigate();

    useEffect(()=>{
        loadData();
    },[]);

    const [data,setData]=useState({});

    const loadData=async ()=>{
        let orgId=getOrgId();
        let {status,message,data}=await $getOrg({id:orgId});
        if(status==0){
            setData(data);

            form.setFieldsValue({
                'id':data.id,
                'name':data.name,
                'intro':data.intro,
                'contactName':data.contact?.name,
                'contactPhone':data.contact?.phone,
            });
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const [form] = Form.useForm();

    const onFinish =async (values) => {
        console.log('Success:', values);
        data.name=values.name;
        data.intro=values.intro;
        data.contact.name=values.contactName;
        data.contact.phone=values.contactPhone;
        let {status,message}=await $saveOrg(data);
        if(status==0){
            notification.info({message:"系统提示",description:message});
            navigate("/org/info");
        }else{
            notification.error({message:"系统提示",description:message});
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <h3>修改组织信息</h3>
            <Form
                form={form}
                name="basic"
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
                    label="组织名称"
                    name="id"
                    hidden={true}
                    rules={[
                        {
                            required: true,
                            message: '组织ID不能为空!',
                        },
                    ]}
                >
                </Form.Item>

                <Form.Item
                    label="组织名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '请输入组织名称!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="组织简介"
                    name="intro"
                    rules={[
                        {
                            required: false,
                            message: '请输入组织简介!',
                        },
                    ]}
                >
                    <Input.TextArea/>
                </Form.Item>


                <Form.Item
                    label="联系人"
                    name="contactName"
                    rules={[
                        {
                            required: false,
                            message: '请输入联系人姓名!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="联系电话"
                    name="contactPhone"
                    rules={[
                        {
                            required: false,
                            message: '请输入联系电话!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>


                <Form.Item
                    wrapperCol={{
                        offset: 4,
                        span: 16,
                    }}
                >
                    <Space>
                        <Button  type="primary" htmlType="submit">
                            确定
                        </Button>
                        <Button  htmlType="button" onClick={()=>{
                            navigate("/org/info");
                        }}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>

            </Form>
        </>
    );

}