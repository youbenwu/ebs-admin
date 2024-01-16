import React, {useState,useImperativeHandle} from "react"
import { Form, Input, notification, Space,Button,Modal,Select} from "antd";
import { getLocalHotel} from "../../utils/StorageUtils";
import MyUpload from "../../components/MyUpload/MyUpload";
import {getHotelRoomTypePage, saveHotelRoom} from "../../api/HotelAdminApi";

export default function HotelRoomEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState({});
    const [image, setImage] = useState();

    const [hotelId, setHotelId] = useState();
    const [types, setTypes] = useState([]);

    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       if(data.hotelId==null){
           data.hotelId=getLocalHotel()?.id;
       }
       setOpen(true);
       form.setFieldsValue({
           'id':data.id,
           'hotelId':data.hotelId,
           'typeId':data.typeId,
           'roomNo':data.roomNo,
           'name':data.name,
           'intro':data.intro,
           'image':data.image,
       });
       setImage(data.image);
       setData(data);
       setHotelId(data.hotelId);
       setTypes([]);
       if(data.hotelId){
           loadTypeData(data.hotelId);
       }

   }

    const loadTypeData= async (hotelId)=>{

        let {status,message,data:{content}}=await getHotelRoomTypePage({hotelId:hotelId,page:0,size:100});
        //console.log(data)
        if(status==0){
            content=content.map(t=>{
                return {
                    value:t.id,
                    label:t.name,
                };
            });
            setTypes(content)
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveHotelRoom(values);
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
                title={"编辑房间"}
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
                    onValuesChange={(changedValues, allValues)=>{
                        setHotelId(allValues.hotelId);
                    }}
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
                        label="酒店ID"
                        name="hotelId"
                        hidden={data.hotelId?true:false}
                        rules={[
                            {
                                required: true,
                                message: '请输入酒店ID!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="房型"
                        name="typeId"
                        rules={[
                            {
                                required: true,
                                message: '请选择房型!',
                            },
                        ]}
                    >
                        <Select options={types} onDropdownVisibleChange={(open)=>{
                            //console.log(types)
                            //console.log(data)
                            if(types.length==0){
                                if(hotelId){
                                    loadTypeData(hotelId);
                                }
                            }
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="房间号"
                        name="roomNo"
                        rules={[
                            {
                                required: true,
                                message: '请输入房间号!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="房间名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入房间名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="房间简介"
                        name="intro"
                        rules={[
                            {
                                required: false,
                                message: '请输入房间简介!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="房间图片"
                        name="image"
                        rules={[
                            {
                                required: false,
                                message: '请上传房间图片!',
                            },
                        ]}
                    >
                        <MyUpload image={image} onChange={(url)=>{
                            form.setFieldsValue({
                                'image':url
                            });
                        }}/>
                    </Form.Item>


                </Form>

            </Modal>
        </>
    );

}

