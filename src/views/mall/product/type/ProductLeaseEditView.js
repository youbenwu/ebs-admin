import React, {useState, useEffect} from "react"
import {Radio,Row,Space} from "antd";

export default function ProductLeaseEditView ({lease,onChange}) {

    const [data,setData]=useState({});

    useEffect(()=>{
        setData(lease??{});
    },[lease])

    useEffect(()=>{
        console.log(data)
        onChange(data);
    },[data])

    const leaseField=(
        <Radio.Group value={data.field??5}  onChange={(e)=>{
            setData({
                ...data,
                field:e.target.value,
            });
        }}>
            <Radio value={5}>年</Radio>
            <Radio value={4}>月</Radio>
            <Radio value={3}>日</Radio>
        </Radio.Group>
    );

    //1--分钟 2--小时 3--天 4--月 5--年
    return (
        <>
            <Space direction={"vertical"}>
                <Radio.Group value={data.lease??false} onChange={(e)=>{
                    //console.log(e)
                    setData({
                        ...data,
                        field:data.field??5,
                        lease:e.target.value,
                    });
                }}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                </Radio.Group>
                {data.lease?("租期（年、月、日）"):(<></>)}
                {data.lease?(leaseField):(<></>)}
            </Space>

        </>
    );


}