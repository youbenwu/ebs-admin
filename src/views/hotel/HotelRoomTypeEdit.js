import React, {useState,useImperativeHandle} from "react"
import { Form, Input, notification, Space,Button,Modal,Select} from "antd";
import {saveHotelRoomType} from "../../api/HotelAdminApi";
import {getHotel} from "../../utils/StorageUtils";

export default function HotelRoomTypeEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState({});

    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       if(data.hotelId==null){
           data.hotelId=getHotel().id;
       }
       setOpen(true);
       setData(data);
       form.setFieldsValue({
           'id':data.id,
           'hotelId':data.hotelId,
           'name':data.name,
           'intro':data.intro,
           'price':data.price,
           'num':data.num,
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveHotelRoomType(values);
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
                title={data.id?"编辑房型":"新增房型"}
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
                                required: false,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="酒店ID"
                        name="hotelId"
                        hidden={data.hotelId?true:false}
                        rules={[
                            {
                                required: true,
                                message: '请输入酒店ID!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="房型名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入房型名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="房型简介"
                        name="intro"
                        rules={[
                            {
                                required: false,
                                message: '请输入房型简介!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="可住人数"
                        name="num"
                        rules={[
                            {
                                required: true,
                                message: '请输入可住人数!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="价格"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: '请输入价格!',
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

