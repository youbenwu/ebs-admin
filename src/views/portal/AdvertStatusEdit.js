import React, {useState,useImperativeHandle} from "react"
import {Form, Input, notification, Button, Modal, Select} from "antd";
import {setAdvertStatus} from "../../api/AdvertAdminApi";
import AdvertInfoView from "./AdvertInfoView";

export default function AdvertStatusEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState({});




    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));


   const openModel=(data)=>{
       setOpen(true);
       setData(data);
       form.setFieldsValue({
           'id':data.id,
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await setAdvertStatus({
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


    ////0--正常 1--禁用 2--未审核 3--审核中 4--审核失败
    const options = [
        {
            value:0,
            label:'正常',
        },
        {
            value:2,
            label:'未审核',
        },
        {
            value:3,
            label:'审核中',
        },
        {
            value:4,
            label:'审核失败',
        },
    ];



    return (
        <>
            <Modal
                open={open}
                title="审核广告信息"
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
                <AdvertInfoView data={data}/>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 6,
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
                        label="审核结果"
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

