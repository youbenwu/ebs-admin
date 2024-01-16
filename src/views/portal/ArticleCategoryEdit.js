import React, {useState,useImperativeHandle,useEffect} from "react"
import {Form, Input, notification, Button, Modal,Select,TreeSelect} from "antd";
import {getLocalOrg} from "../../utils/StorageUtils";
import {saveArticleCategory} from "../../api/ArticleAdminApi";
import MyUpload from "../../components/MyUpload/MyUpload";


export default function ArticleCategoryEdit ({cref,onEditFinish,list}) {

    const [data, setData] = useState({});
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);

    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));

    useEffect(()=>{
        let options=getOptionsData(list);
        setOptions(options);
    },[list])

    const getOptionsData=(list)=>{
        let options=list.map((t)=>{
            return {
                ...t,
                value:t.id,
                title:t.title,
                children:t.children?getOptionsData(t.children):null,
            }
        });
        return options;
    }




    useEffect(()=>{
        form.setFieldsValue({
            'id':data.id,
            'orgId':data.orgId??getLocalOrg().id,
            'parentId':data.parentId,
            'title':data.title,
            'description':data.description,
            'image':data.image,
            'status':data.status,
            'type':data.type,
            'sort':data.sort,
        });
    },[data])


    const openModel=(data)=>{
        setOpen(true);
        setData(data);
    }


    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveArticleCategory(values);
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
                forceRender
                open={open}
                title="编辑文章类别"
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
                        label="orgId"
                        name="orgId"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {data.id?(<></>):(
                        <Form.Item
                            label="上级类别"
                            name="parentId"
                            rules={[
                                {
                                    required: false,
                                    message: '请选择上级类别!',
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
                                treeData={options}
                            />
                        </Form.Item>
                    )}



                    <Form.Item
                        label="类别名称"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '请输入类别名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="类别描述"
                        name="description"
                        rules={[
                            {
                                required: false,
                                message: '请输入类别描述!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="分类图片"
                        name="image"
                        rules={[
                            {
                                required: false,
                                message: '请上传分类图片!',
                            },
                        ]}
                    >
                        <MyUpload image={data.image} onChange={(url)=>{
                            form.setFieldsValue({
                                'image':url
                            });
                        }} id={data.id}/>
                    </Form.Item>

                    <Form.Item
                        label="文章类型"
                        name="type"
                        rules={[
                            {
                                required: false,
                                message: '请输入文章类型!',
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
                                required: false,
                                message: '请输入排序号!',
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

