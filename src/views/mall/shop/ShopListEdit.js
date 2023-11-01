import React, { useState, useImperativeHandle } from "react";
import { Button, Modal, Form, Input, Select, notification, Space } from "antd";
import { productSave, productGet } from "../../../api/ShopApi";
import { getHotel } from "../../../utils/StorageUtils";
import MyUploadList from "../../../components/MyUpload/MyUploadList";
import { CloseOutlined } from "@ant-design/icons";

export default function ShopCategoryEdit({ cref, onEditFinish, categoryList }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [images, setImages] = useState([]);

  useImperativeHandle(cref, () => ({
    showModel: async (e) => {
      form.resetFields();
      setImages([]);
      if (e.id) {
        let { data } = await productGet({ id: e.id });
        data.attributes = data.attributes ? data.attributes[0].attributes : [];
        form.setFieldsValue(data);
        setImages(data.images);
      }
      setId(e.id || null);
      setOpen(true);
    },
  }));

  const [form] = Form.useForm();

  const onCancel = () => {
    setOpen(false);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const onFinish = async (values) => {
    setLoading(true);
    let { status, message } = await productSave({
      shopId: getHotel().shopId,
      id,
      title: values.title,
      spcId: values.spcId,
      skus: [
        {
          name: values.title,
          price: values.price,
          stock: values.stock,
        },
      ],
      attributes: [
        {
          name: "附加项",
          attributes: values.attributes,
        },
      ],
      images: values.images,
    });
    setLoading(false);
    if (status == 0) {
      notification.info({ message: "系统提示", description: message });
      setOpen(false);
      onEditFinish(true);
    } else {
      notification.error({ message: "系统提示", description: message });
    }
  };
  return (
    <>
      <Modal
        open={open}
        title={id ? "编辑分类" : "新增分类"}
        onCancel={onCancel}
        onOk={handleOk}
        footer={[
          <Button key="back" onClick={onCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            保存
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            productType: "30",
            attributes: [{}],
          }}
        >
          <Form.Item
            label="商品标题"
            name="title"
            rules={[
              {
                required: true,
                message: "请输入商品标题!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="商品价格"
            name="price"
            rules={[
              {
                required: true,
                message: "请输入商品价格!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="商品库存"
            name="stock"
            rules={[
              {
                required: true,
                message: "请输入商品库存!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="商品分类"
            name="spcId"
            rules={[
              {
                required: true,
                message: "请选择商品分类!",
              },
            ]}
          >
            <Select
              options={categoryList.map((e) => {
                return {
                  value: e.id,
                  label: e.title,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            label="商品图片"
            name="images"
            rules={[
              {
                required: true,
                message: "请上传商品图片!",
              },
            ]}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <MyUploadList
                num={3}
                images={images}
                onChange={(url) => {
                  form.setFieldsValue({
                    images: url,
                  });
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item label="附加项">
            <Form.List name="attributes">
              {(fields, { add, remove }) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 16,
                  }}
                >
                  {fields.map((field) => (
                    <Space key={field.key}>
                      <Form.Item
                        noStyle
                        name={[field.name, "name"]}
                        rules={[{ required: true, message: "请输入名称" }]}
                      >
                        <Input placeholder="请输入名称" />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={[field.name, "value"]}
                        rules={[{ required: true, message: "请输入价格" }]}
                      >
                        <Input placeholder="请输入价格" type="number" />
                      </Form.Item>
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    + 添加附加项
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
