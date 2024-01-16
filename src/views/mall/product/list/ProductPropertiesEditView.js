import React, {useState, useEffect, useRef} from "react"
import {Button, Space, Table, Checkbox,notification} from "antd";
import ProductPropertyEdit from "./ProductPropertyEdit";
import MyDeleteButton from "../../../../components/buttons/MyDeleteButton";

export default function ProductPropertiesEditView ({properties,onChange}) {

    const [data,setData]=useState([]);

    const propertyEdit=useRef();

    useEffect(()=>{
        let i=1
        properties?.forEach(t=>{
            t.index=i++
        })
        setData(properties??[])

    },[properties])



    const columns = [
        {
            title: '规格组名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '规格组值',
            dataIndex: 'values',
            key: 'values',
            render: (_, {items}) => (
                <>
                    <Checkbox.Group
                        options={items.map(t=>{return {"value":t.value,"label":t.value}})}
                        value={items.filter(t=>t.selected===true).map(t=>t.value)}
                        onChange={(v)=>{
                            //console.log(v)
                            items.forEach(t=>{
                                t.selected=v.includes(t.value)
                            })
                            setData([...data])
                            onChange(data);
                            //console.log(data)
                        }}
                    />
                </>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{
                        propertyEdit.current.showModel(record)
                    }}>编辑</Button>
                    <MyDeleteButton onConfirm={()=>{
                        let d=data.filter(t=>t!=record);
                        let i=1;
                        d.forEach(t=>{
                            t.index=i++;
                        })
                        setData(d)
                    }}/>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Space size="small" direction="vertical" style={{width:'100%'}}>
                <Button onClick={()=>{propertyEdit.current.showModel({})}}>新增规格组</Button>
                <Table
                    rowKey="name"
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    locale={{ emptyText: '请新增规格组' }}
                    size="small"
                    bordered
                />
            </Space>
            <ProductPropertyEdit cref={propertyEdit} onEditFinish={(v)=>{
                let r=false;
                data.forEach(t=>{
                    if(t.index!=v.index&&t.name==v.name){
                        r=true;
                    }
                })

                if(r){
                    notification.error({message:"系统提示",description:"规格名称重复"});
                    return;
                }


                if(v.index){
                    data[v.index-1]=v;
                }else{
                    v.index=data.length+1
                    data.push(v)
                }
                setData([...data]);
                onChange(data);
            }}/>
        </>
    );


}