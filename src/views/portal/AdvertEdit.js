import React, {useState,useImperativeHandle,forwardRef,useEffect} from "react"
import { DatePicker,Form, Input, notification,Button,Modal,Select,Space} from "antd";
import {getLocalOrg} from "../../utils/StorageUtils";
import {getAdvertChannelPage, saveAdvert} from "../../api/AdvertAdminApi";
import MyUpload from "../../components/MyUpload/MyUpload";
import MyUploadFile from "../../components/MyUpload/MyUploadFile";
import MyUploadList from "../../components/MyUpload/MyUploadList";
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

function AdvertEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState([]);

    const [channelId, setChannelId] = useState(0);

    const [advertType, setAdvertType] = useState(0);

    const [image, setImage] = useState(null);

    const [qrCode, setQrCode] = useState(null);

    const [video, setVideo] = useState(null);

    const [images, setImages] = useState([]);

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
        let type=getLocalOrg().type==0?'':1;
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

    //广告类型 CPM--普通图片视频广告 CPC--带广告链接 CPA--带二维码
    const types=[
        {
            value:'CPM',
            label:'CPM',
        },
        {
            value:'CPC',
            label:'CPC',
        },
        {
            value:'CPA',
            label:'CPA',
        }
    ];


   const openModel=({data})=>{
       setOpen(true);
       let orgId=data.orgId?data.orgId:getLocalOrg().id;
       data.advertType=data.advertType?data.advertType:'CPM';
       setChannelId(data.channelId);
       //setImage(data.image)
       setImages(getImagesList(data.images?data.images:data.image));
       setQrCode(data.qrCode)
       setVideo(data.video)
       setAdvertType(data.advertType)


       form.setFieldsValue({
           'id':data.id,
           'type':data.type??0,
           'orgId':orgId,
           'display':data.display??false,
           'status':data.status??0,
           'citys':data.citys,
           'channelId':data.channelId,
           'advertType':data.advertType,
           'title':data.title,
           'subtitle':data.subtitle,
           //'image':data.image,
           'images':data.images?data.images:data.image,
           'url':data.url,
           'times':data.startTime?[dayjs(data.startTime, dateFormat),dayjs(data.endTime, dateFormat)]:[],
       });
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        console.log(values);
        setLoading(true);
        let {status,message}=await saveAdvert({
            ...values,
            startTime:values.times[0]?.format(dateFormat),
            endTime:values.times[1]?.format(dateFormat),
        });
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

    const getImagesStr=(images)=>{
        var str="";
        images.forEach(t=>{
            str+=","+t.url;
        })
        if(str.length>0){
            str=str.substr(1);
        }
        return str;
    }

    const getImagesList=(str)=>{
        if(!str)
            return [];
        var images=[];
        str.split(",").forEach(t=>{
            images.push({
                url:t
            });
        })
        return images;
    }

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
                        label="type"
                        name="type"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="status"
                        name="status"
                        hidden={true}
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="display"
                        name="display"
                        hidden={true}
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="citys"
                        name="citys"
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
                                required: true,
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
                        label="广告类型"
                        name="advertType"
                        rules={[
                            {
                                required: false,
                                message: '请选择广告类型!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="请选择广告类型!"
                            options={types}
                            onChange={(e)=>{
                                console.log(e);
                                setAdvertType(e);
                            }}
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
                        <Input placeholder="请输入广告标题!"/>
                    </Form.Item>

                    <Form.Item
                        label="广告副标题"
                        name="subtitle"
                        rules={[
                            {
                                required: false,
                                message: '请输入广告副标题!',
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="请输入广告副标题!" />
                    </Form.Item>



                    <Form.Item
                        label="广告图片"
                        name="images"
                        rules={[
                            {
                                required: true,
                                message: "请上传广告图片!",
                            },
                        ]}
                    >
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <MyUploadList
                                num={3}
                                images={images}
                                onChange={(v) => {
                                    form.setFieldsValue({
                                        images: getImagesStr(v),
                                    });
                                }}
                            />
                        </Space>
                    </Form.Item>

                    <Form.Item
                        label="广告视频"
                        name="video"

                        rules={[
                            {
                                required: false,
                                message: '请输入链接或上传广告视频!',
                            },
                        ]}
                    >
                        <Space direction="vertical" style={{width:'100%'}}>
                            <Input.TextArea value={video} placeholder="请输入链接或上传广告视频!" onChange={(e)=>{
                                setVideo(e.target.value)
                                form.setFieldsValue({
                                    'video':e.target.value
                                });
                            }}/>
                            <MyUploadFile onChange={(url)=>{
                                setVideo(url)
                                form.setFieldsValue({
                                    'video':url
                                });
                            }} />
                        </Space>

                    </Form.Item>


                    <Form.Item
                                label="广告URL"
                                name="url"
                                hidden={advertType=="CPC"}
                                rules={[
                                    {
                                        required: false,
                                        message: '请输入广告URL!',
                                    },
                                ]}
                            >
                                <Input.TextArea placeholder="请输入广告URL!"/>
                    </Form.Item>


                    <Form.Item
                            label="广告二维码"
                            name="qrCode"
                            hidden={advertType=="CPA"}
                            rules={[
                                {
                                    required: false,
                                    message: '请输入链接或上传广告二维码!',
                                },
                            ]}
                        >
                            <Space direction="vertical" style={{width:'100%'}}>
                                <Input.TextArea value={qrCode} placeholder="请输入链接或上传广告二维码!" onChange={(e)=>{
                                    setQrCode(e.target.value)
                                    form.setFieldsValue({
                                        'qrCode':e.target.value
                                    });
                                }}/>
                                <MyUpload image={qrCode} onChange={(url)=>{
                                    setQrCode(url)
                                    form.setFieldsValue({
                                        'qrCode':url
                                    });
                                }} />
                            </Space>

                   </Form.Item>


                    <Form.Item
                        label="显示时间"
                        name="times"
                        rules={[
                            {
                                required: false,
                                message: '请选择显示开始结束时间!',
                            },
                        ]}
                    >
                        <RangePicker />
                    </Form.Item>


                </Form>

            </Modal>
        </>
    );

}

export default AdvertEdit