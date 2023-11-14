import React, {useState,useEffect,useImperativeHandle} from "react"
import { Form, Input, notification, Select,Button,Modal} from "antd/es/index";
import {getProductTypeEnum, saveProductBsType} from "../../../../api/ProductAdminApi";

export default function ProductBsTypeEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [types, setTypes] = useState([]);

    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));

    useEffect(()=>{
        form.setFieldsValue({
            'type':data.type,
            'describe':data.describe,
        });
    },[data])

    useEffect(()=>{
        loadTypes().then();
    },[])

   const openModel=(data)=>{
       setOpen(true);
       setData(data);
   }


   const loadTypes=async ()=>{
       let {status,message,data}=await getProductTypeEnum({});
       if(status==0){
           data=data.map(t=>{
               return {
                   ...t,
                   value:t.type,
                   label:t.describe,
               };
           });
           setTypes(data);
       }
   }

    const [form] = Form.useForm();


    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveProductBsType(values);
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
                title="编辑商品业务类型"
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
                        label="类型"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: '请选择类型!',
                            },
                        ]}
                    >
                        <Select options={types} onChange={(v)=>{
                            let type=types.find(t=>t.value===v);
                            form.setFieldsValue({
                                'describe':type.describe,
                            });
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="描述"
                        name="describe"
                        rules={[
                            {
                                required: true,
                                message: '请输入类型描述!',
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

