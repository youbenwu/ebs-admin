import React, {} from "react"
import {Row,Col,Space,Divider} from "antd";
import OrderProductCells from "./OrderProductCells";
import OrderBuyerCell from "./OrderBuyerCell";
import OrderStatusCell from "./OrderStatusCell";
import OrderAmountCell from "./OrderAmountCell";



export default function OrderRow ({order,onChanged}) {

    /**
    *
     * 订单状态
     00 待付款：用户下单未付款状态
     10 待发货：用户付款商家未发货状态
     20 待签收：商家发货用户未签收状态
     30 已完成：用户签收交易完成状态
     40 已关闭：待付款超时、全额退款完成进入该状态
    *
    * **/
    const showTime=()=>{
        if(order.status===0){
            return (<div>下单时间：{order.createTime}</div>);
        }else if(order.status===10){
            return (<div>成交时间：{order.successTime}</div>);
        }else if(order.status===20){
            return (<div>发货时间：{order.deliveryTime}</div>);
        }else if(order.status===30){
            return (<div>完成时间：{order.finishTime}</div>);
        }else if(order.status===40){
            return (<div>关闭时间：{order.closeTime}</div>);
        }
    };

    return (
        <>
            <Row style={{
                border: '1px solid #B4FDFF'
            }}>
                <Row style={{
                    backgroundColor:'#B4FDFF',
                    width:'100%',
                    height:'36px',
                    padding:'0px 5px'
                }}>
                    <Space>
                        <div>订单编号：{order.orderNo}</div>
                        {showTime()}
                    </Space>
                </Row>
                <Row style={{width:'100%',textAlign:'center'}}>
                    <Col span={12} style={{borderRight:'1px solid #eee'}}>
                       <OrderProductCells products={order.products}/>
                    </Col>
                    <Col span={4} style={{borderRight:'1px solid #eee'}}>
                        <OrderBuyerCell order={order}/>
                    </Col>
                    <Col span={4} style={{borderRight:'1px solid #eee'}}>
                        <OrderStatusCell order={order} onChanged={onChanged}/>
                    </Col>
                    <Col span={4}>
                        <OrderAmountCell order={order}/>
                    </Col>


                </Row>
            </Row>
        </>
    );

}

