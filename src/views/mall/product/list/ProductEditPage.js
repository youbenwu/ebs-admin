import React, {useState,useEffect} from "react"
import {Form, Input, notification, Space,Cascader,Radio} from "antd";
import {Button} from 'antd'
import {useNavigate,useLocation} from 'react-router-dom'
import {getProductCategoryList} from "../../../../api/ProductCategoryApi";
import {getProduct, saveProduct} from "../../../../api/ProductAdminApi";
import MyUpload from "../../../../components/MyUpload/MyUploadList";
import ProductPropertiesEditView from "./ProductPropertiesEditView";
import ProductSkusEditView from "./ProductSkusEditView";
import {tree_findNodeById, tree_findPathById} from "../../../../utils/tree";
import {generateCombinations} from "../../../../utils/sku";
import {getLocalMerchant} from "../../../../utils/StorageUtils";
import {getSpCategoryList} from "../../../../api/ShopAdminApi";


export default function ProductEditPage () {

    const navigate=useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [categorys,setCategorys]=useState([]);
    const [spcs,setSpcs]=useState([]);
    const [data,setData]=useState({});
    const [images,setImages]=useState([]);
    const [properties,setProperties]=useState([]);
    const [skus,setSkus]=useState([]);
    const [medias,setMedias]=useState([]);

    useEffect(()=>{
        //加载商品详情
        const loadData=async (id)=>{
            let {status,data}=await getProduct({id:id});
            if(status==0){
                data.properties.forEach(p=>{
                    if(!p.items){
                        p.items=p.value?JSON.parse(p.value):[];
                    }
                    p.items?.forEach(t=>{
                        t.selected=true;
                    })
                })
                setData(data);
                setImages(data.images??[]);
                setProperties(data.properties??[]);
                setSkus(data.skus??[]);
                setMedias(data.medias??[]);
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
        //加载分类数据
        const loadSpCategoryList=async ()=>{
            let {status,data}=await getSpCategoryList({shopId:getLocalMerchant()?.shopId});
            if(status==0){
                data=toOptions(data)
                setSpcs(data);
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
        loadSpCategoryList().then();
    },[]);


    useEffect(()=>{
        let path=(categorys&&data.categoryId)?tree_findPathById(categorys,data.categoryId):null;
        let path2=(spcs&&data.spcId)?tree_findPathById(spcs,data.spcId):null;
        form.setFieldsValue({
            'id':data.id,
            'shopId':data.shopId??getLocalMerchant()?.shopId,
            'spcId':path2?.map(t=>t.id),
            'categoryId':path?.map(t=>t.id),
            'title':data.title,
            'subtitle':data.subtitle,
            'onSell':data.onSell??true,
            'distribution':data.distribution??false,
            'commissionType':data.commissionType,
            'commissionRate':data.commissionRate,
            'commissionAmount':data.commissionAmount,
        });
    },[data]);

    useEffect(()=>{
        form.setFieldsValue({
            'images':images,
        });
    },[images]);

    useEffect(()=>{
        let ps=properties.map(p=>{
            return {
                ...p,
                items:p.items?.filter(i=>i.selected===true),
            };
        })
        //console.log('properties:', ps);
        form.setFieldsValue({
            'properties':ps,

        });
    },[properties]);

    useEffect(()=>{
        form.setFieldsValue({
            'skus':skus,
        });
    },[skus]);

    useEffect(()=>{
        form.setFieldsValue({
            'medias':medias,
        });
    },[medias]);


    const generateSkus=(properties)=>{
        let newSkus=generateCombinations(properties).filter(t=>t.enable);
        let skuMap=new Map();
        data.skus?.forEach(sku=>{
            skuMap.set(sku.name,sku);
        })
        newSkus=newSkus.map(sku=>{
            let s=skuMap.get(sku.name);
            if(s) {
                return {
                    ...s,
                    value: sku.value,
                    items: sku.items,
                }
            }
            return sku;
        })
        //console.log(newSkus);
        setSkus(newSkus)
    }



    const [form] = Form.useForm();

    const onFinish =async (values) => {
        let categoryId=values.categoryId[values.categoryId.length-1];
        let category=tree_findNodeById(categorys,categoryId);
        let spcId=values.spcId[values.spcId.length-1];
        let request={
            ...values,
            categoryId:categoryId,
            spcId:spcId,
            type:category.productType,
        }
        console.log('request:', request);
        setLoading(true)
        let {status,message}=await saveProduct(request);
        setLoading(false)
        if(status==0){
            notification.info({message:"系统提示",description:message});
            navigate(location.state?.from??"/mall/product/list");
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
                    label="店铺分类"
                    name="spcId"
                    rules={[
                        {
                            required: true,
                            message: '请选择店铺分类!',
                        },
                    ]}
                >
                    <Cascader options={spcs} placeholder="请选择店铺分类" />
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
                    label="shopId"
                    name="shopId"
                    hidden={true}
                    rules={[
                        {
                            required: true,
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
                            required: true,
                            message: '请上传商品图片!',
                        },
                    ]}
                >
                    <MyUpload images={images} onChange={(v)=>{
                        setImages(v);
                    }}/>
                </Form.Item>

                <Form.Item
                    label="商品规格"
                    name="properties"
                    rules={[
                        {
                            required: false,
                            message: '请设置商品规格!',
                        },
                    ]}
                >
                    <ProductPropertiesEditView
                        properties={properties}
                        onChange={(ps)=>{
                            //console.log(ps)
                            setProperties([...ps])
                            generateSkus(ps)
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="商品SKU"
                    name="skus"
                    rules={[
                        {
                            required: true,
                            message: '请设置商品SKU!',
                        },
                    ]}
                >
                    <ProductSkusEditView
                        skus={skus}
                        add={!data.properties||data.properties.length===0}
                        onChange={(skus)=>{
                            setSkus(skus);
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="商品详情图片"
                    name="medias"
                    rules={[
                        {
                            required: false,
                            message: '请上传商品详情图片!',
                        },
                    ]}
                >
                    <MyUpload images={medias} onChange={(v)=>{
                        setMedias(v);
                    }}/>
                </Form.Item>



                <Form.Item
                    label="是否上架"
                    name="onSell"
                    rules={[
                        {
                            required: true,
                            message: '请选择是否上架!',
                        },
                    ]}
                >
                    <Radio.Group defaultValue={true}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>
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
                            navigate(location.state?.from??"/mall/product/list");
                        }}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>



            </Form>
        </>
    );

}