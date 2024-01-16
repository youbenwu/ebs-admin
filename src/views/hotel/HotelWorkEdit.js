import React, {useState,useEffect,useImperativeHandle} from "react"
import { Form, Input, notification, Space,Button,Modal,Select,DatePicker} from "antd";
import {getLocalHotel} from "../../utils/StorageUtils";
import dayjs from 'dayjs';
import {
    saveHotelWorkOrder
} from "../../api/HotelAdminApi";

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export default function HotelWorkEdit ({cref,onEditFinish}) {

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
           data.hotelId=getLocalHotel()?.id;
       }
       setOpen(true);

       form.setFieldsValue({
           'id':data.id,
           'hotelId':data.hotelId,
           'roomNo':data.roomNo,
           'userName':data.userName,
           'userPhone':data.userPhone,
           'name':data.name,
           'content':data.content,
           'times':data.startTime?[dayjs(data.startTime, dateFormat),dayjs(data.endTime, dateFormat)]:[],
       });
       setData(data);

   }



    const [form] = Form.useForm();

    const onFinish =async (values) => {
        // console.log(values.times[0].toISOString());
        // console.log(values.times[0].toISOString());

        values.startTime=values.times[0].format(dateFormat)
        values.endTime=values.times[1].format(dateFormat)
        //console.log(values);
        setLoading(true);
        let {status,message}=await saveHotelWorkOrder(values);
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
                title={"编辑服务"}
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
                        //setHotelId(allValues.hotelId);
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
                        label="客户名称"
                        name="userName"
                        rules={[
                            {
                                required: false,
                                message: '请输入客户名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="客户手机"
                        name="userPhone"
                        rules={[
                            {
                                required: false,
                                message: '请输入客户手机!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="服务名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入服务名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="服务内容"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: '请输入服务内容!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="服务时间"
                        name="times"
                        rules={[
                            {
                                required: true,
                                message: '请选择服务时间!',
                            },
                        ]}
                    >
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={(dates, dateStrings)=>{
                                //console.log(dateStrings);
                            }}
                            onOk={()=>{

                            }}
                        />
                    </Form.Item>


                </Form>

            </Modal>
        </>
    );

}

