import React, {useState,useEffect} from "react"
import {Form, Input, notification, Space,Cascader} from "antd";
import {Button} from 'antd'
import {useNavigate,useLocation} from 'react-router-dom'
import {getProductCategoryList} from "../../../../api/ProductCategoryAdminApi";
import {getProduct, saveProduct} from "../../../../api/ProductAdminApi";
import MyUpload from "../../../../components/MyUpload/MyUploadList";

export default function ProductEditPage () {

    const navigate=useNavigate();
    const location = useLocation();

    const [categorys,setCategorys]=useState([]);
    const [data,setData]=useState({});

    useEffect(()=>{
        //加载商品详情
        const loadData=async (id)=>{
            let {status,data}=await getProduct({id:id});
            if(status==0){
               setData(data)
            }
        }
        let id=location.state?.id;
        if(id){
            loadData(id).then()
        }
    },[]);

    useEffect(()=>{
        //加载分类数据
        const loadCategoryList=async ()=>{
            let {status,data}=await getProductCategoryList({});
            if(status==0){
                data=toOptions(data)
                setCategorys(data);
            }
        }
        const toOptions=(data)=>{
            data=data.map(t=>{
                return {
                    ...t,
                    value:t.id,
                    label:t.title,
                    children:t.children?toOptions(t.children):null,
                }
            })
            return data;
        }
        loadCategoryList().then();
    },[]);


    useEffect(()=>{
        form.setFieldsValue({
            'id':data.id,
            'title':data.title,
            'subtitle':data.subtitle,
            'images':data.images,
        });
    },[data]);


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        let request={
            ...values,
            categoryId:values.categoryId[values.categoryId.length-1]
        }
        console.log('request:', request);
        let {status,message}=await saveProduct(request);
        if(status==0){
            notification.info({message:"系统提示",description:message});
            navigate("/mall/product/list");
        }else{
            notification.error({message:"系统提示",description:message});
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <h3>编辑商品信息</h3>
            <Form
                form={form}
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
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item
                    label="商品类别"
                    name="categoryId"
                    rules={[
                        {
                            required: true,
                            message: '请选择商品类别!',
                        },
                    ]}
                >
                    <Cascader options={categorys} placeholder="请选择商品类别" />
                </Form.Item>


                <Form.Item
                    label="商品ID"
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
                    label="商品标题"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: '请输入商品标题!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="商品副标题(卖点)"
                    name="subtitle"
                    rules={[
                        {
                            required: false,
                            message: '请输入副标题!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>


                <Form.Item
                    label="商品图片"
                    name="images"
                    rules={[
                        {
                            required: false,
                            message: '请上传商品图片!',
                        },
                    ]}
                >
                    <MyUpload images={data.images??[]} onChange={(v)=>{
                        form.setFieldsValue({
                            'images':v,
                        });
                    }}/>
                </Form.Item>





                <Form.Item
                    wrapperCol={{
                        offset: 6,
                        span: 16,
                    }}
                >
                    <Space>
                        <Button  type="primary" htmlType="submit">
                            确定
                        </Button>
                        <Button  htmlType="button" onClick={()=>{
                            navigate("/mall/product/list");
                        }}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>



            </Form>
        </>
    );

}