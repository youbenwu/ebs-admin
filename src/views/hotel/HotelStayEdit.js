import React, {useState,useEffect,useImperativeHandle,forwardRef} from "react"
import {getRoleMenuList, saveRole} from "../../api/OrgAdminApi";
import { Form, Input, notification, Space,Button,Modal,Select,DatePicker} from "antd";
import {getOrgId, getTargetId} from "../../utils/StorageUtils";
import MyUpload from "../../components/MyUpload/MyUpload";
import moment from 'moment'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
    getHotelCumstomer, getHotelCumstomerByPhone,
    getHotelRoomByRoomNo, getHotelRoomPage,
    getHotelRoomTypePage, getHotelStayPage,
    registerHotel,
    saveHotel,
    saveHotelRoom, saveHotelStay,
    saveHotelWorkOrder
} from "../../api/HotelAdminApi";

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export default function HotelStayEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState({});

    const [hotelId, setHotelId] = useState();

    const [rooms, setRooms] = useState();

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
           'customerId':data.customerId,
           'roomNo':data.roomNo,
           'price':data.price,
           'name':data.name,
           'phone':data.phone,
           'idNo':data.idNo,
           'startTime':data.startTime?data.startTime:dayjs().format(dateFormat),
           'stayDays':data.stayDays,
           'rents':data.rents,
       });
       setData(data);
       setHotelId(data.hotelId);

       if(data.hotelId&&data.roomNo==null){
           loadRoomList().then();
       }

   }

    const loadRoomList=async ()=>{
        let {status,message,data}=await getHotelRoomPage({hotelId:hotelId,page:0,size:1000});
        //console.log(data)
        if(status==0){
            data=data.content.map(t=>{
                return {
                    ...t,
                    value:t.roomNo,
                    label:"房间号:"+t.roomNo+" 价格:"+t.type.price
                };
            });
            setRooms(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const loadCustomerData=async (phone)=>{
        let {status,message,data}=await getHotelCumstomerByPhone({hotelId:hotelId,phone:phone});
        //console.log(data)
        if(status==0){
            if(data==null){
                form.setFieldsValue({
                    'name':'',
                    'idNo':'',
                });
                return;
            }
            form.setFieldsValue({
                'name':data.name,
                'phone':data.phone,
                'idNo':data.idNo,
            });
        }
    }


    const [form] = Form.useForm();

    const onFinish =async (values) => {

        setLoading(true);
        let {status,message}=await saveHotelStay(values);
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
                title={"登记入住"}
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
                        label="房间"
                        name="roomNo"
                        rules={[
                            {
                                required: true,
                                message: '请选择房间!',
                            },
                        ]}
                    >
                        <Select options={rooms} onChange={(v)=>{

                            rooms.forEach(t=>{
                                if(t.value==v){
                                    data.price=t.type.price;
                                    form.setFieldsValue({
                                        'price':data.price
                                    });
                                }
                            })

                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="房间价格"
                        name="price"
                        hidden={true}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                    </Form.Item>


                    <Form.Item
                        label="客户手机"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: '请输入客户手机!',
                            },
                        ]}
                    >
                        <Input disabled={data.id?true:false} onChange={(e)=>{
                            let v=e.target.value;
                            if(v.length==11){
                               loadCustomerData(v).then();
                            }
                        }}/>
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


                    <Form.Item
                        label="入住天数"
                        name="stayDays"
                        rules={[
                            {
                                required: true,
                                message: '请输入入住天数!',
                            },
                        ]}
                    >
                        <Input onChange={(e)=>{
                            if(data.price){
                                let v=e.target.value;
                                form.setFieldsValue({
                                    'rents':data.price*v
                                });
                            }
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="押金"
                        name="rents"
                        rules={[
                            {
                                required: true,
                                message: '请输入押金!',
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

