import React, {useState,useEffect,useImperativeHandle,forwardRef} from "react"
import {saveRole} from "../../api/OrgAdminApi";
import { Form, Input, notification, Space,Button,Modal} from "antd";
import {getOrgId} from "../../utils/StorageUtils";
import MyUpload from "../../components/MyUpload/MyUpload";
import {registerHotel, saveHotel} from "../../api/HotelAdminApi";

function HotelEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [image, setImage] = useState();
    const [logo, setLogo] = useState();
    const [license, setLicense] = useState();



    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       setOpen(true);
       form.setFieldsValue({
           'id':data.id,
           'name':data.name,
           'intro':data.intro,
           'contactName':data.contact.name,
           'contactPhone':data.contact.phone,
           'contactAddress':data.contact.address?.fullAddress,
           'logo':data.logo,
           'image':data.image,
           'license':data.license,
       });
       setLogo(data.logo);
       setImage(data.image);
       setLicense(data.license);
   }


    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveHotel({
            id:values.id,
            name:values.name,
            intro:values.intro,
            contact:{name:values.contactName,phone:values.contactPhone,address:{fullAddress:values.contactAddress}},
            logo:values.logo,
            image:values.image,
            license:values.license,
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

    return (
        <>
            <Modal
                open={open}
                title="编辑酒店"
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
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>

                    <Form.Item
                        label="酒店名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入酒店名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="酒店简介"
                        name="intro"
                        rules={[
                            {
                                required: false,
                                message: '请输入酒店简介!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="酒店地址"
                        name="contactAddress"
                        rules={[
                            {
                                required: false,
                                message: '请输入酒店地址!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="酒店LOGO"
                        name="logo"
                        rules={[
                            {
                                required: false,
                                message: '请上传酒店LOGO!',
                            },
                        ]}
                    >
                        <MyUpload image={logo} onChange={(url)=>{
                            form.setFieldsValue({
                                'logo':url
                            });
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="酒店封面"
                        name="image"
                        rules={[
                            {
                                required: false,
                                message: '请上传酒店封面!',
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
                        label="营业执照"
                        name="license"
                        rules={[
                            {
                                required: false,
                                message: '请上传营业执照!',
                            },
                        ]}
                    >
                        <MyUpload image={license} onChange={(url)=>{
                            form.setFieldsValue({
                                'license':url
                            });
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="联系人姓名"
                        name="contactName"
                        rules={[
                            {
                                required: true,
                                message: '请输入联系人姓名!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="联系人手机"
                        name="contactPhone"
                        rules={[
                            {
                                required: true,
                                message: '请输入联系电话!',
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

export default HotelEdit