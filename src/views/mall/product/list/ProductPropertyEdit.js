import React, {useState,useImperativeHandle,useEffect} from "react"
import {Form, Input, Button, Modal} from "antd";


export default function ProductPropertyEdit ({cref,onEditFinish}) {

    const [data, setData] = useState({});

    const [open, setOpen] = useState(false);

    const [pform] = Form.useForm();

    const openModel=(property)=>{
        setOpen(true);
        setData(property2Data(property));
    }


    useImperativeHandle(cref, () => ({
        showModel: (property) => {
            openModel(property);
        }
    }));

    const property2Data=(property)=>{
        if(!property.items){
            property.items=property.value?JSON.parse(property.value):[];
        }
        let items=property.items.map(t=>{return t.value});
        let data={
            ...property,
            "values":items.join("\n"),
        };
        return data;
    }

    const data2Property=(values)=>{
        let items=values.values?values.values.split("\n").map(t=>t.trim()):[];
        //去掉空格
        items=items.filter(t=>t.length>0);
        //去掉重复
        items=[...new Set(items)];
        items=items.map(v=>{return {"value":v,"selected":true}})
        //console.log(items)
        let property={
            ...data,
            "name":values.name,
            "items":items,
        };
        return property;
    }


    useEffect(()=>{
        pform.setFieldsValue({
            "name":data.name,
            "values":data.values,
        });
    },[data])




    const onFinish =async (values) => {
        let p=data2Property(values);
        //console.log(p);
        onEditFinish(p);
        setOpen(false);
    };


    const onCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        pform
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
                title="编辑规格组"
                onCancel={onCancel}
                onOk={handleOk}
                footer={[
                    <Button key="back" onClick={onCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        确定
                    </Button>
                ]}
            >
                <Form
                    form={pform}
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
                    autoComplete="off"
                >


                    <Form.Item
                        label="规格组名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入规格组名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="规格组值"
                        extra="一行一个值"
                        name="values"
                        rules={[
                            {
                                required: true,
                                message: '请填写规格组值!',
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="请填写规格组值!"/>
                    </Form.Item>


                </Form>

            </Modal>
        </>
    );

}

