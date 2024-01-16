import React, {} from "react"
import {Row,Col,Divider,Space} from "antd";



export default function OrderAmountCell ({order}) {



    return (
        <>
            <div >{order.totalAmount}</div>
            <div style={{color:'#555'}}>(含快递:{order.freight})</div>
        </>
    );

}

