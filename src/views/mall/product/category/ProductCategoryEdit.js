import React, {useState,useImperativeHandle,useEffect} from "react"
import {Form, Input, notification, Button, Modal,Select,TreeSelect} from "antd";
import {saveProductCategory} from "../../../../api/ProductCategoryAdminApi";
import MyUpload from "../../../../components/MyUpload/MyUpload";
import {getMenuList} from "../../../../api/MenuAdminApi";
import {getProductTypeList} from "../../../../api/ProductTypeAdminApi";


export default function ProductCategoryEdit ({cref,onEditFinish,list}) {

    const [data, setData] = useState({});
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState([]);

    const [types, setTypes] = useState([]);


    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));

    useEffect(()=>{
        const loadTypesData= async ()=>{
            let {status,data}=await getProductTypeList({});
            if(status===0){
                data=data.map(t=>{
                    return {
                        ...t,
                        value:t.id,
                        label:t.name,
                    }
                });
                setTypes(data);
            }
        }
        loadTypesData().then();
    },[])



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
            'parentId':data.parentId,
            'title':data.title,
            'description':data.description,
            'image':data.image,
            'typeId':data.typeId,
            'productType':data.productType,
            'sort':data.sort,
        });
    },[data])


    const openModel=(data)=>{
        setOpen(true);
        setData(data);
    }


    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveProductCategory(values);
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
                title="编辑商品类别"
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
                        label="productType"
                        name="productType"
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
                                onChange={(v)=>{
                                    let d=options.find(t=>t.value===v);
                                    if(d) {
                                        form.setFieldsValue({
                                            'typeId': d.typeId,
                                            'productType': d.productType,
                                        });
                                    }
                                }}
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
                        label="商品类型"
                        name="typeId"
                        rules={[
                            {
                                required: false,
                                message: '请选择商品类型!',
                            },
                        ]}
                    >

                        <Select options={types} onChange={(v)=>{
                            let d=types.find(t=>t.value===v);
                            if(d){
                                form.setFieldsValue({
                                    'typeId': d.id,
                                    'productType': d.type,
                                });
                            }
                        }}/>

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

