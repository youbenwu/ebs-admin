import React from 'react';
import './RegisterHotelPage.scss'
import { Button, Form, Input,notification,Space } from 'antd';
import {useNavigate} from 'react-router-dom'
import {registerHotel} from "../../api/HotelAdminApi";
import MyUpload from "../../components/MyUpload/MyUpload";

export default function RegisterHotelPage(){
    const navigate=useNavigate();
    const [form] = Form.useForm();

    const onFinish =async (values) => {
        let {status,message}=await registerHotel({
            name:values.name,
            intro:values.intro,
            contact:{name:values.contactName,phone:values.contactPhone,address:{fullAddress:values.contactAddress}},
            logo:values.logo,
            image:values.image,
            license:values.license,
            password:values.password,
        });
        if(status==0){
            notification.info({message:"系统提示",description:message});
            navigate(-1);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='hotel-register1'>
            <div className='content1'>
                <h2>酒店入驻</h2>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 5,
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
                        label="酒店名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入酒店名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="酒店简介"
                        name="intro"
                        rules={[
                            {
                                required: false,
                                message: '请输入酒店简介!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="酒店地址"
                        name="contactAddress"
                        rules={[
                            {
                                required: false,
                                message: '请输入酒店地址!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="酒店LOGO"
                        name="logo"
                        rules={[
                            {
                                required: false,
                                message: '请上传酒店LOGO!',
                            },
                        ]}
                    >
                        <MyUpload  onChange={(url)=>{
                            form.setFieldsValue({
                                'logo':url
                            });
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="酒店封面"
                        name="image"
                        rules={[
                            {
                                required: false,
                                message: '请上传酒店封面!',
                            },
                        ]}
                    >
                        <MyUpload  onChange={(url)=>{
                            form.setFieldsValue({
                                'image':url
                            });
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="营业执照"
                        name="license"
                        rules={[
                            {
                                required: false,
                                message: '请上传营业执照!',
                            },
                        ]}
                    >
                        <MyUpload  onChange={(url)=>{
                            form.setFieldsValue({
                                'license':url
                            });
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="联系人姓名"
                        name="contactName"
                        rules={[
                            {
                                required: true,
                                message: '请输入联系人姓名!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="联系人手机"
                        name="contactPhone"
                        rules={[
                            {
                                required: true,
                                message: '请输入联系电话!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="登陆密码"
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
                        wrapperCol={{
                            offset: 4,
                            span: 16,
                        }}
                    >
                        <Space>
                            <Button  type="primary" htmlType="submit">
                                注册
                            </Button>
                            <Button  htmlType="button" onClick={()=>{navigate(-1)}}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>

                </Form>
            </div>
        </div>
    );


}