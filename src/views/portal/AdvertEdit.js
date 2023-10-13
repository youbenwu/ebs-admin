import React, {useState,useImperativeHandle,forwardRef,useEffect} from "react"
import { Form, Input, notification,Button,Modal,Select} from "antd";
import {getOrgId, getOrgType} from "../../utils/StorageUtils";
import {getAdvertChannelPage, saveAdvert} from "../../api/AdvertAdminApi";
import MyUpload from "../../components/MyUpload/MyUpload";
import {getChannelPage} from "../../api/ChannelAdminApi";


function AdvertEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState([]);

    const [channelId, setChannelId] = useState(0);

    const [image, setImage] = useState(null);

    useEffect(()=>{
        loadChannelList().then(()=>{});
    },[])


    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            //loadChannelList().then(()=>{});
            openModel({data});
        }
    }));

    const loadChannelList=async ()=>{
        let type=getOrgType()==0?'':1;
        let {status,message,data}=await getAdvertChannelPage({type:type,page:0,size:50});

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


   const openModel=({data})=>{
       setOpen(true);
       let orgId=data.orgId?data.orgId:getOrgId();
       setChannelId(data.channelId);
       setImage(data.image)
       form.setFieldsValue({
           'id':data.id,
           'orgId':orgId,
           'channelId':data.channelId,
           'title':data.title,
           'subtitle':data.subtitle,
           'image':data.image,
           'url':data.url,
           'startTime':data.startTime,
           'endTime':data.endTime,
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveAdvert(values);
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
                title="编辑广告"
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
                        label="orgId"
                        name="orgId"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="频道"
                        name="channelId"
                        rules={[
                            {
                                required: false,
                                message: '请选择频道!',
                            },
                        ]}
                    >
                        <Select
                            value={channelId}
                            placeholder="请选择频道!"
                            onChange={(e)=>{
                                console.log(e);
                                form.setFieldsValue({
                                    'channelId':e
                                });
                            }}
                            options={options}
                            allowClear
                        >
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="广告标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '请输入广告标题!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="广告副标题"
                        name="subtitle"
                        rules={[
                            {
                                required: true,
                                message: '请输入广告副标题!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>


                    <Form.Item
                        label="广告图片"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: '请上传广告图片!',
                            },
                        ]}
                    >
                        <MyUpload image={image} onChange={(url)=>{
                            form.setFieldsValue({
                                'image':url
                            });
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="广告URL"
                        name="url"
                        rules={[
                            {
                                required: false,
                                message: '请输入广告URL!',
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

export default AdvertEdit