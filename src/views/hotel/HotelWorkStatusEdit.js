import React, {useState,useImperativeHandle} from "react"
import {Form, Input, notification, Space, Button, Modal, Select} from "antd";
import {
    setHotelWorkOrderStatus
} from "../../api/HotelAdminApi";

export default function HotelWorkStatusEdit ({cref,onEditFinish}) {

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
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        // if(data.status==1){
        //     notification.info({message:"系统提示",description:"当前是住客状态不能修改状态"});
        //     return;
        // }
        setLoading(true);
        let {status,message}=await setHotelWorkOrderStatus({
            id:values.id,
            status:values.status,
            statusRemark:values.statusRemark
        });
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
                title="设置服务状态"
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
                        label="状态"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: '请选择状态!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="请选择状态!"
                            onChange={(e)=>{
                                console.log(e);
                                form.setFieldsValue({
                                    'status':e
                                });
                            }}
                            options={options}
                            allowClear
                        >
                        </Select>
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
                        <Input.TextArea />
                    </Form.Item>


                </Form>

            </Modal>
        </>
    );

}

