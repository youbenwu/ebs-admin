import React, {useState,useImperativeHandle,useEffect} from "react"
import {Form, Input, notification, Button, Modal,Select} from "antd";
import {saveProductType} from "../../../../api/ProductTypeAdminApi";
import {getProductBsTypeList} from "../../../../api/ProductAdminApi";


export default function ProductTypeEdit ({cref,onEditFinish}) {

    const [data, setData] = useState({});
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [bstypes, setBstypes] = useState([]);

    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));

    useEffect(()=>{
        loadBsTypeData().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        form.setFieldsValue({
            'id':data.id,
            'name':data.name,
            'description':data.description,
            'type':data.type,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])


   const openModel=(data)=>{
       setOpen(true);
       setData(data);
   }


    const loadBsTypeData =async () => {
        let {status,data}=await getProductBsTypeList({});
        if(status===0){
            data=data.map(t=>{
                return {
                    ...t,
                    value:t.type,
                    label:t.describe
                };
            });
            setBstypes(data);
        }
    };


    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveProductType(values);
        setLoading(false);
        if(status===0){
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
                forceRender
                open={open}
                title="编辑系统"
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
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="类型名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入类型名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="类型描述"
                        name="description"
                        rules={[
                            {
                                required: false,
                                message: '请输入类型描述!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="业务类型"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: '请选择业务类型!',
                            },
                        ]}
                    >
                        <Select options={bstypes} />
                    </Form.Item>

                </Form>

            </Modal>
        </>
    );

}

