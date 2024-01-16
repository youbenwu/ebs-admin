import React, {useState,useImperativeHandle} from "react"
import {Form, Input, notification, Button, Modal, Select} from "antd";
import {$setCashStatus} from "../../../api/CashAdminApi";

export function CashStatusEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState([]);

    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));


   const openModel=(data)=>{
       setOpen(true);
       form.setFieldsValue({
           'orderNo':data.orderNo,
           'status':'',
           'statusRemark':'',
       });
       //WAIT_PAY(0, "等待支付"),
       //     SUCCEED(1, "申请提现"),
       //     FINISHED(2, "提现完成"),
       //     CLOSED(3, "提现取消");
       if(data.status==1){
           setOptions([
               {
                   value:2,
                   label:'审核通过',
               },
               {
                   value:3,
                   label:'审核失败',
               },
           ]);
       }else{
           setOptions([

           ]);
       }
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await $setCashStatus(values);
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
                        label="orderNo"
                        name="orderNo"
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
                            options={options}
                            onChange={(e)=>{
                                let item=options.find(t=>t.value==e);
                                form.setFieldsValue({
                                    'statusRemark':item.label,
                                });
                            }}
                            allowClear
                        >
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="备注"
                        name="statusRemark"
                        rules={[
                            {
                                required: true,
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
