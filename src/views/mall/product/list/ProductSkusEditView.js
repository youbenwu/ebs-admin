import React, {useState, useEffect, useRef,useContext} from "react"
import {Button, Space, Table,Input,Form,InputNumber,Row, Checkbox,notification} from "antd";
import "./ProductSkusEditView.scss"
import MyDeleteButton from "../../../../components/buttons/MyDeleteButton";
import MyUpload from "../../../../components/MyUpload/MyUploadList";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: false,
                        message: `${title}为必填.`,
                    },
                ]}
            >
                {
                    dataIndex==="price"?(<InputNumber
                            ref={inputRef}
                            onPressEnter={save}
                            onBlur={save}
                            min={0}
                            //defaultValue={0.01}
                            //formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            //parser={(value) => value.replace(/\¥\s?|(,*)/g, '')}
                            style={{ width:'100%'}}
                        />):
                    dataIndex==="stock"?(<InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} style={{ width:'100%'}}/>):
                        (<Input ref={inputRef} onPressEnter={save} onBlur={save} placeholder={`请填写${title}`} style={{ width:'100%'}}/>)
                }
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                    height:'32px'
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }


    return <td {...restProps}>{childNode}</td>;
};



export default function ProductSkusEditView ({skus,onChange,add}) {

    const [data,setData]=useState([]);



    useEffect(()=>{
        let data=skus?skus:[];
        //console.log(skus)
        if(data.length==0&&add){
            data.push({})
        }
        setData(data)
    },[skus])


    const handleSave = (row) => {
        const newData = [...data];
        const index = newData.findIndex((item) => row.name === item.name);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setData(newData);
        onChange(newData);
    };

    const defaultColumns = [
        {
            title: 'SKU名称',
            dataIndex: 'name',
            key: 'name',
            editable: add??false,
            width: '40%',
        },
        {
            title: '库存',
            dataIndex: 'stock',
            key: 'stock',
            editable: true,
            width: '30%',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            editable: true,
            width: '30%',
        },
        {
            title: add?'操作':'',
            key: 'action',
            render: (_, record) => add?(
                <MyDeleteButton onConfirm={()=>{
                    let d=data.filter(t=>t!=record);
                    setData(d)
                    onChange(d)
                }}/>
            ):(<></>),
        },
    ];


    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <>
            <Space size="small" direction="vertical" style={{width:'100%'}}>
                {add?(<Button onClick={()=>{
                    data.push({})
                    setData([...data])
                }}>新增SKU</Button>):(<></>)}
                <Table
                    rowKey="name"
                    components={components}
                    rowClassName={() => 'editable-row'}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    locale={{ emptyText: '请新增SKU' }}
                    size="small"
                    bordered
                    expandable={{
                        expandedRowRender: (record) => (
                            <div>
                                <Row>
                                    <p>SKU图片</p>
                                    <MyUpload images={record.images??[]} onChange={(v)=>{
                                        record.images=v;
                                        onChange(data);
                                    }}/>
                                </Row>
                            </div>
                        ),
                        rowExpandable: (record) => true,
                    }}
                />
            </Space>
        </>
    );


}