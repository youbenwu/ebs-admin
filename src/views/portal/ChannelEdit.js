import React, {useState,useImperativeHandle,forwardRef} from "react"
import { Form, Input, notification,Button,Modal} from "antd";
import {getOrgId} from "../../utils/StorageUtils";
import {saveChannel} from "../../api/ChannelAdminApi";

function ChannelEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       setOpen(true);
       let orgId=data.orgId?data.orgId:getOrgId();
       form.setFieldsValue({
           'id':data.id,
           'orgId':orgId,
           'code':data.code,
           'type':data.type?data.type:0,
           'title':data.title,
           'description':data.description,
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveChannel(values);
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
                title="编辑角色"
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
                        label="orgId"
                        name="orgId"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="频道编码"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: '请输入频道编码!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="频道类型"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: '请输入频道类型!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="频道标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '请输入频道标题!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="频道描述"
                        name="description"
                        rules={[
                            {
                                required: false,
                                message: '请输入频道描述!',
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

export default ChannelEdit