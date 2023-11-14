import React, {useState,useImperativeHandle,useEffect} from "react"
import {Form, Input, notification, Button, Modal,Select,TreeSelect} from "antd";
import MyUpload from "../../../components/MyUpload/MyUpload";
import {saveMenu} from "../../../api/MenuAdminApi";


export default function MenuEdit ({cref,onEditFinish,list}) {

    const [data, setData] = useState({});
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [menus, setMenus] = useState([]);


    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));

    useEffect(()=>{
        let menus=getMenusData(list);
        setMenus(menus);
    },[list])

    const getMenusData=(list)=>{
        let menus=list.map((t)=>{
            return {
                ...t,
                value:t.id,
                title:t.name,
                children:t.children?getMenusData(t.children):null,
            }
        });
        return menus;
    }

    useEffect(()=>{
        form.setFieldsValue({
            'id':data.id,
            'parentId':data.parentId,
            'name':data.name,
            'icon':data.icon,
            'path':data.path,
            'sort':data.sort,
            'status':data.status,
        });
    },[data])


   const openModel=(data)=>{
       setOpen(true);
       setData(data);
   }


    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveMenu(values);
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

    const status = [
        {
            value:0,
            label:'显示',
        },
        {
            value:1,
            label:'隐藏',
        }
    ];

    return (
        <>

            <Modal
                forceRender
                open={open}
                title="编辑菜单"
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

                    {data.id?(<></>):(
                        <Form.Item
                            label="上级菜单"
                            name="parentId"
                            rules={[
                                {
                                    required: false,
                                    message: '请选择上级菜单!',
                                },
                            ]}
                        >
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择"
                                allowClear
                                treeDefaultExpandAll
                                treeData={menus}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="菜单名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入菜单名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="图标"
                        name="icon"
                        rules={[
                            {
                                required: false,
                                message: '请上传图标!',
                            },
                        ]}
                    >
                        <MyUpload image={data.icon} onChange={(url)=>{
                            form.setFieldsValue({
                                'icon':url
                            });
                        }} id={data.id}/>
                    </Form.Item>

                    <Form.Item
                        label="菜单路径"
                        name="path"
                        rules={[
                            {
                                required: true,
                                message: '请输入菜单路径!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="排序号"
                        name="sort"
                        rules={[
                            {
                                required: true,
                                message: '请输入排序号!',
                            },
                        ]}
                    >
                        <Input />
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
                        <Select options={status} />
                    </Form.Item>

                </Form>

            </Modal>
        </>
    );

}

