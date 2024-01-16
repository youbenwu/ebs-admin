import React, { useState, useImperativeHandle } from "react";
import { Button, Modal, Form, Input, Select, notification } from "antd";
import { setCategory } from "../../../api/ShopApi";
import { getLocalHotel } from "../../../utils/StorageUtils";

export default function ShopCategoryEdit({ cref, onEditFinish }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  useImperativeHandle(cref, () => ({
    showModel: (e) => {
      form.setFieldsValue({
        title: e.title,
        productType: e.productType.toString(),
      });
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
    let { status, message } = await setCategory({
      title: values.title,
      productType: values.productType,
      shopId: getLocalHotel().shopId,
      id,
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
          }}
          autoComplete="off"
          //   onValuesChange={(changedValues, allValues) => {
          //     setHotelId(allValues.hotelId);
          //   }}
        >
          <Form.Item
            label="分类标题"
            name="title"
            rules={[
              {
                required: true,
                message: "请输入分类标题!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="商品类型"
            name="productType"
            rules={[
              {
                required: true,
                message: "请输入分类标题!",
              },
            ]}
          >
            <Select
              options={[
                { value: "30", label: "酒店干洗服务" },
                { value: "31", label: "酒店送餐服务" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
