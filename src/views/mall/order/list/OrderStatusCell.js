import React, {useState} from "react"
import {Popconfirm, Button, notification} from "antd";
import {$setOrderStatus} from "../../../../api/OrderAdminApi";


export default function OrderStatusCell ({order,onChanged}) {

    const [loading, setLoading] = useState(false);

    const onChangeStatus= async ({orderNo,status,statusRemark})=>{
        setLoading(true);
        let result=await $setOrderStatus({
            orderNo:orderNo,
            status:status,
            statusRemark:statusRemark,
        });
        setLoading(false);
        if(result.status==0){
            if(onChanged){
                onChanged();
            }
        }else{
            notification.error({message:"系统提示",description:result.message});
        }
    }

    /**
     *
     * 订单状态
     00 待付款：用户下单未付款状态
     10 待发货：用户付款商家未发货状态
     20 待签收：商家发货用户未签收状态
     30 已完成：用户签收交易完成状态
     40 已关闭：待付款超时、全额退款完成进入该状态
     *
     */
    const statsMap={
        0: "买家待付款",
        10:"买家已付款",
        20:"买家待签收",
        30:"已完成",
        40:"已关闭",
    };

    const closeButton=(
        <Popconfirm
            title="提示"
            description="确定关闭该条订单吗?"
            onConfirm={()=>{
                onChangeStatus({orderNo:order.orderNo,status:40,statusRemark:"卖家关闭"}).then();
            }}
            onCancel={()=>{}}
            okText="确定"
            cancelText="取消"
        >
            <Button size="small" loading={loading}>关闭订单</Button>
        </Popconfirm>
    );

    const deliveryButton=(
        <Popconfirm
            title="提示"
            description="确定标记订单状态为已发货吗?"
            onConfirm={()=>{
                onChangeStatus({orderNo:order.orderNo,status:20,statusRemark:"卖家已发货"}).then();
            }}
            onCancel={()=>{}}
            okText="确定"
            cancelText="取消"
        >
            <Button size="small" loading={loading}>发货</Button>
        </Popconfirm>
    );



    const finishButton=(
        <Popconfirm
            title="提示"
            description="确定标记订单状态为已完成吗?"
            onConfirm={()=>{
                onChangeStatus({orderNo:order.orderNo,status:30,statusRemark:"已完成"}).then();
            }}
            onCancel={()=>{}}
            okText="确定"
            cancelText="取消"
        >
            <Button size="small" loading={loading}>完成</Button>
        </Popconfirm>
    );


    const button10=()=>{
        if(order.noDelivery&&order.sellerFinish){
            return (finishButton);
        }
        return deliveryButton;
    };

    return (
        <>
            <div style={{color:'#CD7F32'}}>{statsMap[order.status]}</div>
            {order.status===0?closeButton:(<></>)}
            {order.status===10?button10():(<></>)}
        </>
    );

}

