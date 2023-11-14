import React, {useEffect} from "react"
import {Form, Input, Button, Space} from "antd";


export default function TableKeywordFilterView ({keyword,onSearch}) {

    const [form] = Form.useForm();

    useEffect(()=>{
        form.setFieldsValue({
            'keyword':keyword??'',
        });
    },[keyword])

    return (
        <>
            <Form
                form={form}
                size="small"
                name="control-hooks"
                onFinish={(values)=>{
                    onSearch(values.keyword??'');
                }}
                style={{
                    maxWidth: 600,
                    display: 'flex',
                }}
            >
                <Form.Item
                    name="keyword"
                    label="关键字"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item >
                    <Space>
                        <Button type="primary" htmlType="submit" style={{marginLeft:8}}>
                            筛选
                        </Button>
                        <Button htmlType="button" onClick={()=>{form.resetFields();onSearch("");}}>
                            重置
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );

}

