import React, {useState,useImperativeHandle} from "react"
import {Form, Input, notification, Button, Modal, Select} from "antd";
import {setHotelStatus} from "../../api/HotelAdminApi";

function HotelStatusEdit ({cref,onEditFinish}) {

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
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await setHotelStatus({
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
            label:'正常',
        },
        {
            value:1,
            label:'禁用',
        },
        {
            value:2,
            label:'未审核',
        },
        {
            value:5,
            label:'审核失败',
        },
        {
            value:7,
            label:'欠费',
        },
    ];

    return (
        <>
            <Modal
                open={open}
                title="审核"
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

export default HotelStatusEdit