import React, {useState,useImperativeHandle,useEffect} from "react"
import {Form, Input, notification, Button, Modal, Select} from "antd";
import {
    $getMessageTypePage, $saveMessageTemplate,
} from "../../../api/MessageTypeAdminApi";




function MsgTemplateEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState([]);

    const [data, setData] = useState({});


    useEffect(()=>{
        loadTypeList().then(()=>{});
    },[])



    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));


    const loadTypeList=async ()=>{
        let {status,message,data}=await $getMessageTypePage({page:0,size:1000});

        if(status!=0){
            notification.error({message:"系统提示",description:message});
            return;
        }
        const options = [];
        data.content.forEach((d)=>{
            options.push({
                value: d.id,
                label: d.title,
            });
        });
        setOptions(options);
    }





   const openModel=(data)=>{
       setOpen(true);
       setData(data);
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        console.log(values);
        setLoading(true);
        let {status,message}=await $saveMessageTemplate(values);
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

    useEffect(()=>{
        form.setFieldsValue({
            'id':data.id,
            'name':data.name,
            'typeId':data.typeId,
            'sendType':data.sendType,
            'title':data.title,
            'content':data.content,
            'url':data.url,
            'action':data.action,
            'templateId':data.templateId,
        });
    },[data])



    const sendtypes=[
        {
            value:0,
            label:'站内信',
        },
        {
            value:1,
            label:'邮箱',
        },
        {
            value:2,
            label:'短信',
        },
        {
            value:3,
            label:'推送',
        },
        {
            value:4,
            label:'小程序消息',
        },
    ]




    return (
        <>
            <Modal
                open={open}
                title="编辑消息模板"
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
                        span: 5,
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
                        label="模板名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入模板名称!',
                            },
                        ]}
                    >
                        <Input placeholder="请输入模板名称!" />
                    </Form.Item>


                    <Form.Item
                        label="消息类型"
                        name="typeId"
                        rules={[
                            {
                                required: true,
                                message: '请选择消息类型!',
                            },
                        ]}
                    >
                        <Select options={options}/>
                    </Form.Item>


                    <Form.Item
                        label="发送类型"
                        name="sendType"
                        rules={[
                            {
                                required: true,
                                message: '请选择发送类型!',
                            },
                        ]}
                    >
                        <Select options={sendtypes}/>
                    </Form.Item>

                    <Form.Item
                        label="消息标题模板"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '请输入消息标题模板!',
                            },
                        ]}
                    >
                        <Input placeholder="请输入消息标题模板!" />
                    </Form.Item>

                    <Form.Item
                        label="消息内容模板"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: '请输入消息内容模板!',
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="请输入消息内容模板!" />
                    </Form.Item>

                    <Form.Item
                        label="消息链接模板"
                        name="url"
                        rules={[
                            {
                                required: false,
                                message: '请输入消息链接模板!',
                            },
                        ]}
                    >
                        <Input placeholder="请输入消息链接模板!" />
                    </Form.Item>

                    <Form.Item
                        label="消息按钮名称"
                        name="action"
                        rules={[
                            {
                                required: false,
                                message: '请输入消息按钮名称!',
                            },
                        ]}
                    >
                        <Input placeholder="请输入消息按钮名称!" />
                    </Form.Item>


                    <Form.Item
                        label="外部模板ID"
                        name="templateId"
                        rules={[
                            {
                                required: false,
                                message: '请输入外部模板ID!',
                            },
                        ]}
                    >
                        <Input placeholder="请输入外部模板ID!" />
                    </Form.Item>

                </Form>

            </Modal>
        </>
    );

}

export default MsgTemplateEdit