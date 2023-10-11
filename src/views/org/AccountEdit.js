import React, {useState,useEffect,useImperativeHandle,forwardRef} from "react"
import {getMenuListBySys, getRoleList, saveAccount, saveRole} from "../../api/OrgAdminApi";
import {Form, Input, notification, Space, Button, Modal, Cascader} from "antd";
import {getOrgId, getSysId, getUserId} from "../../utils/StorageUtils";

const { SHOW_CHILD } = Cascader;

export default function AccountEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [roleData, setRoleData] = useState([]);

    const [roleValue, setRoleValue] = useState([]);

    useEffect(()=>{
        loadRoleData().then(()=>{});
    },[])

    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{


       let roles=data.roles?.map((t)=>{
           return [t.roleId]
       });
       setRoleValue(roles);


       setOpen(true);
       let orgId=data.orgId?data.orgId:getOrgId();
       form.setFieldsValue({
           'id':data.id,
           'orgId':orgId,
           'userId':data.userId,
           'name':data.name,
           'phone':data.phone,
           'roles':roles,
           'password':'',
       });
   }

    const loadRoleData= async ()=>{
        let {status,message,data}=await getRoleList({orgId:getOrgId()});

        if(status==0){
            data=data.map(t=>{
                return {
                    value:t.id,
                    label:t.title,
                }
            });
            //console.log(data)
            setRoleData(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let roles=[];
        roleValue?.forEach(t=>{
            t?.forEach(r=>{
                roles.push(r);
            })
        })
        roles=[...new Set(roles)];
        values.roles=roles;
        let {status,message}=await saveAccount(values);
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
                title="编辑帐号"
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
                        label="userId"
                        name="userId"
                        hidden={true}
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="账号名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入账号名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: false,
                                message: '请输入密码!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="设置角色"
                        name="roles"
                        rules={[
                            {
                                required: false,
                                message: '请选择角色!',
                            },
                        ]}
                    >
                        <Cascader
                            style={{ width: '100%' }}
                            options={roleData}
                            onChange={(vs)=>{
                                setRoleValue(vs);
                                //console.log(vs);
                            }}
                            multiple
                            maxTagCount="responsive"
                            showCheckedStrategy={SHOW_CHILD}
                            defaultValue={[]}
                            value={roleValue}
                        />

                    </Form.Item>


                </Form>

            </Modal>
        </>
    );

}

