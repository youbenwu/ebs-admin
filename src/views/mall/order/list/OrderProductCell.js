import React, {} from "react"
import {Row,Col,Divider,Space} from "antd";



export default function OrderProductCell ({product}) {



    return (
        <Row style={{padding:'5px'}}>
            <Col span={16}>
                <Row>
                    <img src={product.productImage} width={50} height={50}/>
                    <Col style={{paddingLeft:'5px'}}>
                        <a>{product.productTitle}</a>
                        <div style={{color:'#555'}}>{product.skuName}</div>
                    </Col>
                </Row>
            </Col>
            <Col span={4}>
                <div>{product.price}</div>
            </Col>
            <Col span={4}>
                <div>{product.quantity}</div>
            </Col>
        </Row>
    );

}

