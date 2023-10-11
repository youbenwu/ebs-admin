import React,{useEffect} from 'react';
import './MsgSendPage.scss'
import { Button, Form, Input,notification,Space } from 'antd';
import {useNavigate} from 'react-router-dom'
import MyUpload from "../../components/MyUpload/MyUpload";
import {sendMessage} from "../../api/MessageAdminApi";
import {getOrgId, getUserId} from "../../utils/StorageUtils";

export default function MsgSendPage(){
    const navigate=useNavigate();
    const [form] = Form.useForm();

    useEffect(()=>{
        let orgId=getOrgId();
        form.setFieldsValue({
            'orgId':orgId==0?'':orgId,
            'fromId':getUserId(),
        });
    },[])

    const onFinish =async (values) => {
        let {status,message}=await sendMessage({
            fromId:values.fromId,
            orgId:values.orgId,
            title:values.title,
            content:values.content,
            image:values.image
        });
        if(status==0){
            notification.info({message:"系统提示",description:message});
            form.resetFields();
        }else{
            notification.error({message:"系统提示",description:message});
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='hotel-register'>
            <div className='content'>
                <h2>发送消息</h2>
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
                        label="orgId"
                        name="orgId"
                        hidden={true}
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="fromId"
                        name="fromId"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="消息标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '请输入消息标题!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="消息内容"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: '请输入消息内容!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="消息图片"
                        name="image"
                        rules={[
                            {
                                required: false,
                                message: '请上传消息图片!',
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
                        wrapperCol={{
                            offset: 4,
                            span: 16,
                        }}
                    >
                        <Space>
                            <Button  type="primary" htmlType="submit">
                                发送
                            </Button>
                            <Button  htmlType="button" onClick={()=>{form.resetFields();}}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>

                </Form>
            </div>
        </div>
    );


}