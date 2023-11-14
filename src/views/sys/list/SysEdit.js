import React, {useState,useImperativeHandle,useEffect} from "react"
import {Form, Input, notification, Button, Modal,Select} from "antd";
import MyUpload from "../../../components/MyUpload/MyUpload";
import {saveSys} from "../../../api/SysAdminApi";


export default function SysEdit ({cref,onEditFinish}) {

    const [data, setData] = useState({});
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));


    useEffect(()=>{
        form.setFieldsValue({
            'id':data.id,
            'name':data.name,
            'sysNo':data.sysNo,
            'description':data.description,
            'logo':data.logo,
            'type':data.type,
        });
    },[data])


   const openModel=(data)=>{
       setOpen(true);
       setData(data);
   }


    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveSys(values);
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

    /**
     *
     * 组织类型
     * 0--平台
     * 1--租户
     * 2--部门
     * 3--商家
     * 4--门店
     * 5--店铺
     * 6--酒店
     *
     */
    const types = [
        {
            value:0,
            label:'平台',
        },
        {
            value:1,
            label:'租户',
        },
        {
            value:2,
            label:'部门',
        },
        {
            value:3,
            label:'商家',
        },
        {
            value:4,
            label:'门店',
        },
        {
            value:5,
            label:'店铺',
        },
        {
            value:6,
            label:'酒店',
        },
    ];

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
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入系统名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="描述"
                        name="description"
                        rules={[
                            {
                                required: false,
                                message: '请输入系统描述!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="编码"
                        name="sysNo"
                        rules={[
                            {
                                required: false,
                                message: '请输入系统编码!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="LOGO"
                        name="logo"
                        rules={[
                            {
                                required: false,
                                message: '请上传LOGO!',
                            },
                        ]}
                    >
                        <MyUpload image={data.logo} onChange={(url)=>{
                            form.setFieldsValue({
                                'logo':url
                            });
                        }} id={data.id}/>
                    </Form.Item>

                    <Form.Item
                        label="类型"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: '请选择类型!',
                            },
                        ]}
                    >
                        <Select options={types} />
                    </Form.Item>

                </Form>

            </Modal>
        </>
    );

}

