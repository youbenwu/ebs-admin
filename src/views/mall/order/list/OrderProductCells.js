import React, {} from "react"
import {Row,Col,Space} from "antd";
import OrderProductCell from "./OrderProductCell";



export default function OrderProductCells ({products}) {

    const rows=products.map(p=>{
        if(products.last!==p){
            return (<div style={{borderBottom:'1px solid #eee'}}><OrderProductCell product={p}/></div>);
        }
        return (<OrderProductCell product={p}/>);
    })

    return (
        rows
    );

}

