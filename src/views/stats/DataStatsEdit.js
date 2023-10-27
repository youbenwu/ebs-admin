import React, {useState,useImperativeHandle} from "react"
import { Form, Input, notification,Button,Modal} from "antd";
import {saveDataStats} from "../../api/DataStatsAdminApi";

export default function DataStatsEdit ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);



    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       setOpen(true);
       form.setFieldsValue({
           'id':data.id,
           'title':data.title,
           'value':data.value,
           'realValue':data.realValue,
           'type':data.type,
           'channel':data.channel,
           'suffix':data.suffix,

       });
   }



    /**
     *
     *  TicketOrderAmountTotal(11, "门票订单总金额", DataStatsChannel.TicketOrderAmountStats.getChannel(),"元"),
     TicketOrderAmount7Day(12, "门票订单最近7天金额", DataStatsChannel.TicketOrderAmountStats.getChannel(),"元"),
     TicketOrderAmountMonth(13, "门票订单当月金额", DataStatsChannel.TicketOrderAmountStats.getChannel(),"元"),
     TicketOrderCountTotal(21, "门票订单总数量", DataStatsChannel.TicketOrderCountStats.getChannel(),""),
     TicketOrderCount7Dat(22, "门票订单最近7天数量", DataStatsChannel.TicketOrderCountStats.getChannel(),""),
     TicketOrderCountMonth(23, "门票订单当月数量", DataStatsChannel.TicketOrderCountStats.getChannel(),""),
     TicketOrderCountDay(24,"门票订单当天数量", DataStatsChannel.TicketOrderCountStats.getChannel(), ""),
     UserActiveDay(31, "日活跃用户", DataStatsChannel.UserStats.getChannel(),""),
     UserActiveMonth(32, "月活跃用户", DataStatsChannel.UserStats.getChannel(),""),
     UserAddDay(41, "日新增用户", DataStatsChannel.UserStats.getChannel(),""),
     UserAddMonth(42,"月新增用户", DataStatsChannel.UserStats.getChannel(), ""),
     HotelDeviceCount(51,"总投放设备数量", DataStatsChannel.HotelDeviceStats.getChannel(), ""),
     HotelDeviceSafeIndex(52, "安全指数", DataStatsChannel.HotelDeviceStats.getChannel(),""),
     HotelDeviceNormalCount(53, "设备正常运行总数", DataStatsChannel.HotelDeviceStats.getChannel(),""),
     HotelDeviceFaultCount(54, "设备故障总数", DataStatsChannel.HotelDeviceStats.getChannel(),""),
     HotelDeviceWarnCount(55, "待处理预警总数", DataStatsChannel.HotelDeviceStats.getChannel(),""),
     HotelDeviceWarnHandleRate(56, "预警处理率", DataStatsChannel.HotelDeviceStats.getChannel(),"");

     *
     * **/




    const [form] = Form.useForm();

    const onFinish =async (values) => {
        setLoading(true);
        let {status,message}=await saveDataStats(values);
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
                title="编辑数据"
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
                        label="realValue"
                        name="realValue"
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
                                message: '请输入标题!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="分组"
                        name="channel"
                        rules={[
                            {
                                required: true,
                                message: '请输入分组!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="类型"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: '请输入类型!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="显示值"
                        name="value"
                        rules={[
                            {
                                required: false,
                                message: '请输入显示值!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="显示后缀"
                        name="suffix"
                        rules={[
                            {
                                required: false,
                                message: '请输入显示后缀!',
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

