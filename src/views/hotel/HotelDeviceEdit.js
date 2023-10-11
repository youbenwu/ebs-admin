import React, {useState,useEffect,useImperativeHandle} from "react"
import { Form, Input, notification, Space,Button,Modal} from "antd";
import {saveHotelDevice} from "../../api/HotelAdminApi";

export default function HotelDeviceEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       setOpen(true);
       form.setFieldsValue({
           'id':data.id,
           'hotelId':data.hotelId,
           'roomNo':data.roomNo,
           'deviceNo':data.deviceNo,
           'name':data.name,
           'model':data.model,
           'os':data.os,
           'appType':data.appType,
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveHotelDevice(values);
        setLoading(false);
        if(status==0){
            notification.info({message:"系统提示",description:message});
            onEditFinish(true);
            setOpen(false);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    };


    const onCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onFinish(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <>
            <Modal
                open={open}
                title="编辑酒店"
                onCancel={onCancel}
                onOk={handleOk}
                footer={[
                    <Button key="back" onClick={onCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        保存
                    </Button>
                ]}
            >
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
                    autoComplete="off"
                >
                    <Form.Item
                        label="id"
                        name="id"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="hotelId"
                        name="hotelId"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="设备型号"
                        name="deviceNo"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="房间号"
                        name="roomNo"
                        rules={[
                            {
                                required: true,
                                message: '请输入房间号!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="设备名称"
                        name="name"
                        rules={[
                            {
                                required: false,
                                message: '请输入设备名称!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="设备型号"
                        name="model"
                        rules={[
                            {
                                required: false,
                                message: '请输入设备型号!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="设备系统"
                        name="os"
                        rules={[
                            {
                                required: false,
                                message: '请输入设备系统!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="应用类型"
                        name="appType"
                        rules={[
                            {
                                required: true,
                                message: '请输入应用类型!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                </Form>

            </Modal>
        </>
    );

}

