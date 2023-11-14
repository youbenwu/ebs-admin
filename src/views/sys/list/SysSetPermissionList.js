import React, {useState,useEffect,useImperativeHandle} from "react"
import {notification, Button, Modal, Cascader, Form, Input} from "antd";
import {getSysPermissionList, setSysPermissionList} from "../../../api/SysAdminApi";
import {getPermissionList} from "../../../api/PermissionAdminApi";


const { SHOW_CHILD } = Cascader;


export default function SysSetPermissionList ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const [data, setData] = useState([]);

    const [id, setId] = useState(0);

    const [form] = Form.useForm();

    useEffect(()=>{
        loadData().then(()=>{});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));


    useEffect(()=>{
        form.setFieldsValue({
            'sysId':id,
            'permissions':[],
        });
        loadValueData().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

   const openModel=(data)=>{
       setOpen(true);
       setId(data.id);
   }


   const loadData= async ()=>{
       let {status,message,data}=await getPermissionList({});
       if(status===0){
           data=coverData(data);
           //console.log(data)
           setData(data);
       }else{
           notification.error({message:"系统提示",description:message});
       }
   }

    const coverData=(data)=>{
        return data?.map(t=>{
            return {
                value:t.id,
                label:t.title,
                leaf:t.leaf,
                children:coverData(t.children),
            };
        });

    }

    const loadValueData= async ()=>{
        let {status,message,data}=await getSysPermissionList({sysId:id});
        if(status===0){
            data=coverValueData(data);
            //console.log(data)
            form.setFieldsValue({
                'sysId':id,
                'permissions':data,
            });
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const coverValueData=(data)=>{
        let ids=[];
        data.forEach(t=>{
            ids.push(t.permissionId);
        })

        let v=toValue(ids);

        return v;
    }

    const toValue=(ids)=>{
        let set =new Set(ids);
        let all=[];
        data.forEach(t=>{
            t.children.forEach(t2=>{
                t2.children.forEach(t3=>{
                    if(set.has(t3.value)) {
                        all.push([t.value, t2.value, t3.value]);
                    }
                })
            })
        })
        return all;
    }



    const toSaveData=(value)=>{
        let ids=[];
        value.forEach(r=>{
           r.forEach(p=>{
               ids.push(p);
           })
        })
        ids= [...new Set(ids)];
        return ids;
    }




    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await setSysPermissionList({
            ...values,
            permissions:toSaveData(values.permissions),
        });
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
                title="设置权限"
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
                        label="系统ID"
                        name="sysId"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="权限"
                        name="permissions"
                        rules={[
                            {
                                required: false,
                                message: '请选择权限!',
                            },
                        ]}
                    >
                        <Cascader
                            style={{ width: '100%' }}
                            options={data}
                            multiple
                            maxTagCount="responsive"
                            showCheckedStrategy={SHOW_CHILD}
                            loading={loading}
                        />
                    </Form.Item>

                </Form>

            </Modal>
        </>
    );

}

