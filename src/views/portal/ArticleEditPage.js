import React, {useState,useEffect} from "react"
import {Form, Input, notification, Space,Cascader,Radio} from "antd";
import {Button} from 'antd'
import {useNavigate,useLocation} from 'react-router-dom'
import {getArticle, getArticleCategoryList, saveArticle} from "../../api/ArticleAdminApi";
import {tree_findPathById} from "../../utils/tree";
import {getLocalUser} from "../../utils/StorageUtils";
import EditorView from "../../components/editor/editor";


export default function ArticleEditPage () {

    const navigate=useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [categorys,setCategorys]=useState([]);
    const [data,setData]=useState({});

    useEffect(()=>{
        //加载商品详情
        const loadData=async (id)=>{
            let {status,data}=await getArticle({id:id});
            if(status==0){
                setData(data);
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
            let {status,data}=await getArticleCategoryList({});
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
        let path=(categorys&&data.categoryId)?tree_findPathById(categorys,data.categoryId):null;
        form.setFieldsValue({
            'id':data.id,
            'userId':data.userId??getLocalUser().id,
            'categoryId':path?(path?.map(t=>t.id)):data.categoryId,
            'title':data.title,
            'content':data.content,
            'code':data.code,
        });
    },[data,categorys]);


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        let categoryId=values.categoryId[values.categoryId.length-1];
        let request={
            ...values,
            categoryId:categoryId,
            medias:[],
        }
        console.log('request:', request);
        setLoading(true)
        let {status,message}=await saveArticle(request);
        setLoading(false)
        if(status==0){
            notification.info({message:"系统提示",description:message});
            navigate("/portal/article/list");
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
                    maxWidth: 800,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item
                    label="文章类别"
                    name="categoryId"
                    rules={[
                        {
                            required: true,
                            message: '请选择文章类别!',
                        },
                    ]}
                >
                    <Cascader options={categorys} placeholder="请选择文章类别" />
                </Form.Item>

                <Form.Item
                    label="userId"
                    name="userId"
                    hidden={true}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                </Form.Item>


                <Form.Item
                    label="文章ID"
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
                    label="文章标题"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: '请输入文章标题!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="文章编码"
                    name="code"
                    rules={[
                        {
                            required: false,
                            message: '请输入文章编码!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="文章内容"
                    name="content"
                    rules={[
                        {
                            required: true,
                            message: '请输入文章内容!',
                        },
                    ]}
                >
                    <EditorView/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 6,
                        span: 16,
                    }}
                >
                    <Space>
                        <Button  type="primary" htmlType="submit" loading={loading}>
                            确定
                        </Button>
                        <Button  htmlType="button" onClick={()=>{
                            navigate("/portal/article/list");
                        }}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>



            </Form>
        </>
    );

}