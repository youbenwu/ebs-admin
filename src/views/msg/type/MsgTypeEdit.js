import React, {useState,useImperativeHandle,useEffect} from "react"
import {Form, Input, notification, Button, Modal, Select, Radio} from "antd";
import {$getMessageTemplatePage, $getMessageType, $saveMessageType} from "../../../api/MessageTypeAdminApi";
import MsgTypeTagsEditView from "./MsgTypeTagsEditView";




function MsgTypeEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState([]);

    const [data, setData] = useState({});





    useImperativeHandle(cref, () => ({
        showModel: (data) => {
            openModel(data);
        }
    }));



    const loadData=async (id)=>{
        let {status,message,data}=await $getMessageType({"id":id});

        if(status!=0){
            notification.error({message:"系统提示",description:message});
            return;
        }
        setData(data);
    }


    const loadTemplatelList=async (id)=>{
        let {status,message,data}=await $getMessageTemplatePage({typeId:id,page:0,size:1000});

        if(status!=0){
            notification.error({message:"系统提示",description:message});
            return;
        }
        const options = [];
        data.content.forEach((d)=>{
            options.push({
                value: d.id,
                label: d.name,
                sendType: d.sendType,
            });
        });
        setOptions(options);
    }

    useEffect(()=>{
        form.setFieldsValue({
            'id':data.id,
            'title':data.title,
            'tags':data.tags??[],
            'name':data.name,
            'status':data.status??0,
            'email':data.email??false,
            'mp':data.mp??false,
            'msg':data.msg??true,
            'push':data.push??false,
            'sms':data.sms??false,
            'emailTemplateId':data.emailTemplateId,
            'mpTemplateId':data.mpTemplateId,
            'msgTemplateId':data.msgTemplateId,
            'pushTemplateId':data.pushTemplateId,
            'smsTemplateId':data.smsTemplateId,
        });
    },[data])



   const openModel=(data)=>{
       setOpen(true);
       setData({});
       if(data.id) {
           loadData(data.id).then();
       }
       setOptions([]);
       if(data.id){
           loadTemplatelList(data.id).then(()=>{});
       }
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        console.log(values);
        setLoading(true);
        let {status,message}=await $saveMessageType(values);
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
                open={open}
                title="编辑消息类型"
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
                        label="标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '请输入类型标题!',
                            },
                        ]}
                    >
                        <Input placeholder="请输入类型标题!" />
                    </Form.Item>

                    <Form.Item
                        label="编码"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入类型编码!',
                            },
                        ]}
                    >
                        <Input placeholder="请输入类型编码!" />
                    </Form.Item>

                    <Form.Item
                        label="模板标签"
                        name="tags"
                        rules={[
                            {
                                required: true,
                                message: '请输入模板标签!',
                            },
                        ]}
                    >
                        <MsgTypeTagsEditView/>
                    </Form.Item>

                    <Form.Item
                        label="站内信"
                        name="msg"
                        rules={[
                            {
                                required: true,
                                message: '请选择是否站内信!',
                            },
                        ]}
                    >
                        <Radio.Group defaultValue={true}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="短信"
                        name="sms"
                        rules={[
                            {
                                required: true,
                                message: '请选择是否短信!',
                            },
                        ]}
                    >
                        <Radio.Group defaultValue={true}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="APP推送"
                        name="push"
                        rules={[
                            {
                                required: true,
                                message: '请选择是否APP推送!',
                            },
                        ]}
                    >
                        <Radio.Group defaultValue={true}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="微信消息"
                        name="mp"
                        rules={[
                            {
                                required: true,
                                message: '请选择是否微信消息!',
                            },
                        ]}
                    >
                        <Radio.Group defaultValue={true}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="邮件"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: '请选择是否微信邮件!',
                            },
                        ]}
                    >
                        <Radio.Group defaultValue={true}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="站内信模板"
                        name="msgTemplateId"
                        rules={[
                            {
                                required: false,
                                message: '请选择站内信模板!',
                            },
                        ]}
                    >
                        <Select options={options.filter(t=>t.sendType===0)}/>
                    </Form.Item>

                    <Form.Item
                        label="邮箱模板"
                        name="emailTemplateId"
                        rules={[
                            {
                                required: false,
                                message: '请选择邮箱模板!',
                            },
                        ]}
                    >
                        <Select options={options.filter(t=>t.sendType===1)}/>
                    </Form.Item>

                    <Form.Item
                        label="短信模板"
                        name="smsTemplateId"
                        rules={[
                            {
                                required: false,
                                message: '请选择短信模板!',
                            },
                        ]}
                    >
                        <Select options={options.filter(t=>t.sendType===2)}/>
                    </Form.Item>

                    <Form.Item
                        label="推送模板"
                        name="pushTemplateId"
                        rules={[
                            {
                                required: false,
                                message: '请选择推送模板!',
                            },
                        ]}
                    >
                        <Select options={options.filter(t=>t.sendType===3)}/>
                    </Form.Item>

                    <Form.Item
                        label="微信消息模板"
                        name="mpTemplateId"
                        rules={[
                            {
                                required: false,
                                message: '请选择微信消息模板!',
                            },
                        ]}
                    >
                        <Select options={options.filter(t=>t.sendType===4)}/>
                    </Form.Item>

                    <Form.Item
                        label="状态"
                        name="status"
                        rules={[
                            {
                                message: '请选择状态!',
                                required: true,
                            },
                        ]}
                    >
                        <Radio.Group defaultValue={0}>
                            <Radio value={0}>正常</Radio>
                            <Radio value={1}>禁用</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Form>

            </Modal>
        </>
    );

}

export default MsgTypeEdit