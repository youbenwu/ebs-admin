import React, {useState,useEffect,useImperativeHandle,forwardRef} from "react"
import {getRoleMenuList, saveRole} from "../../api/OrgAdminApi";
import { Form, Input, notification, Space,Button,Modal,Select} from "antd";
import {getOrgId, getTargetId} from "../../utils/StorageUtils";
import MyUpload from "../../components/MyUpload/MyUpload";
import {
    getHotelRoomTypePage,
    registerHotel,
    saveHotel,
    saveHotelCumstomer,
    saveHotelRoom
} from "../../api/HotelAdminApi";

export default function HotelCustomerEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState({});


    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       if(data.hotelId==null){
           data.hotelId=getTargetId();
       }
       setOpen(true);
       form.setFieldsValue({
           'id':data.id,
           'hotelId':data.hotelId,
           'name':data.name,
           'phone':data.phone,
           'idNo':data.idNo,
       });
       setData(data);

   }



    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveHotelCumstomer(values);
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
                title={"编辑客户"}
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
                        label="客户手机号"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: '请输入客户手机号!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="客户名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入客户名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="身份证号码"
                        name="idNo"
                        rules={[
                            {
                                required: false,
                                message: '请输入客户身份证号码!',
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

