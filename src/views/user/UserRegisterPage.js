import React, {useState,useEffect,useImperativeHandle,forwardRef} from "react"
import {saveRole} from "../../api/OrgAdminApi";
import {Form, Input, notification, Space, Button, Modal, Checkbox} from "antd";
import {getOrgId, saveUser} from "../../utils/StorageUtils";
import {$login} from "../../api/UserApi";

export default function UserRegisterPage () {
    const navigate=useNavigate();
    const [form] = Form.useForm();

    const onFinish =async (values) => {
        console.log('Success:', values);
        let {status,message,data}=await $login(values);
        if(status==0){
            //保存登陆后的用户信息
            saveUser(data);
            notification.info({message:"系统提示",description:message});
            navigate('/');
        }else{
            notification.error({message:"系统提示",description:message});
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onReset = () => {
        form.resetFields();
    };
    return (
        <div className='login'>
            <div className='content'>
                <h2>迁眼信息管理系统</h2>
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
                            <Button  type="link" onClick={()=>{
                                navigate("/hotel/register");
                            }}>
                                注册酒店
                            </Button>
                        </Space>
                    </Form.Item>

                </Form>
            </div>
        </div>
    );

}
