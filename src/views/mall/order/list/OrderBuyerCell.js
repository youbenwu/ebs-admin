import React, {} from "react"
import {Row,Col,Divider,Space} from "antd";



export default function OrderBuyerCell ({order}) {

    return (
        <div>
            <a>{order.user.realName??order.user.nickname}</a>
            <div>{order.user.phone}</div>
            <div>{order.roomNo?("房间号："+order.roomNo):''}</div>
        </div>
    );

}

