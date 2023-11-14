import React, {useState,useImperativeHandle} from "react"
import {Form, Input, notification, Button, Modal} from "antd";
import { setHotelStayStatus,
} from "../../api/HotelAdminApi";

export default function HotelStayStatusEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState({});


    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       setData(data);
       setOpen(true);
       form.setFieldsValue({
           'id':data.id,
           'roomNo':data.roomNo,
           'price':data.price,
           'stayDays':data.stayDays,
           'rents':data.rents,
           'amount':data.rents,
           'status':2,
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        // if(data.status==1){
        //     notification.info({message:"系统提示",description:"当前是住客状态不能修改状态"});
        //     return;
        // }
        setLoading(true);
        let {status,message}=await setHotelStayStatus(values);
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



    const options = [
        {
            value:0,
            label:'未处理',
        },
        {
            value:1,
            label:'已处理',
        },
    ];

    return (
        <>
            <Modal
                open={open}
                title="退房结算"
                onCancel={onCancel}
                onOk={handleOk}
                footer={[
                    <Button key="back" onClick={onCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        确定
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
                        label="status"
                        name="status"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="入住房间号"
                        name="roomNo"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled={true} />
                    </Form.Item>

                    <Form.Item
                        label="房间价格"
                        name="price"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled={true} />
                    </Form.Item>


                    <Form.Item
                        label="已交押金"
                        name="rents"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled={true} />
                    </Form.Item>

                    <Form.Item
                        label="入住天数"
                        name="stayDays"
                        rules={[
                            {
                                required: true,
                                message: '请输入入住天数!',
                            },
                        ]}
                    >
                        <Input disabled={false} />
                    </Form.Item>

                    <Form.Item
                        label="消费金额"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: '请输入消费金额!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="备注"
                        name="statusRemark"
                        rules={[
                            {
                                required: false,
                                message: '请输入状态备注!',
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

