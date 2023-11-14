import React, {useState,useEffect,useImperativeHandle,forwardRef} from "react"
import {saveRole} from "../../api/OrgAdminApi";
import { Form, Input, notification, Space,Button,Modal} from "antd";

function UserRegister ({cref,onRegisterFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({phone,nickname})=>{
       setOpen(true);
       form.setFieldsValue({
           'username':phone,
           'orgId':orgId,
           'name':data.name,
           'title':data.title,
           'description':data.description,
           'sort':data.sort,
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveRole(values);
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
                        label="角色名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入角色名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="角色标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '请输入角色标题!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="角色描述"
                        name="description"
                        rules={[
                            {
                                required: false,
                                message: '请输入角色描述!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="排序"
                        name="sort"
                        rules={[
                            {
                                required: false,
                                message: '请输入排序序号!',
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

export default forwardRef(RoleEdit)