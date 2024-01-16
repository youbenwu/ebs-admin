import React, { useEffect, useRef, useState } from "react";
import { getCategoryList, delCategory } from "../../../api/ShopApi";
import { Button, Tabs, Table, Space, Popconfirm, Form, Input } from "antd";
import ShopCategoryEdit from "./ShopCategoryEdit";
import { getLocalHotel } from "../../../utils/StorageUtils";

export default function ShopCategoryList() {
  const shopCategoryEdit = useRef();
  const [list, setList] = useState([]);
  const [productType, setProductType] = useState("");
  const [keyword, setKeyword] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    getList();
  }, [productType, keyword]);

  const getList = () => {
    getCategoryList({
      shopId: getLocalHotel().shopId,
      productType,
      keyword,
    }).then((res) => {
      setList(res.data);
    });
  };
  const onDelete = (e) => {
    delCategory({ shopId: getLocalHotel().shopId, id: e.id }).then((res) => {
      getList();
    });
  };

  const onChange = (e) => {
    setProductType(e);
  };

  const items = [
    {
      key: "",
      label: "全部",
    },
    {
      key: "30",
      label: "酒店干洗服务",
    },
    {
      key: "31",
      label: "酒店送餐服务",
    },
  ];
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "分类标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "商品类型",
      dataIndex: "productType",
      key: "productType",
      render(text) {
        let config = {
          30: "酒店干洗服务",
          31: "酒店送餐服务",
        };
        return config[text];
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            onClick={() => {
              shopCategoryEdit.current.showModel({ ...record });
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="确定删除该条记录吗?"
            onConfirm={() => {
              onDelete(record);
            }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div className="header">
        <div className="filter">
          <Form
            form={form}
            size="small"
            name="control-hooks"
            onFinish={(values) => {
              setKeyword(values.keyword);
            }}
            style={{
              maxWidth: 600,
              display: "flex",
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
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: 8 }}
                >
                  筛选
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>

        <Button
          onClick={() => {
            shopCategoryEdit.current.showModel({
              title: "",
              productType: "30",
            });
          }}
        >
          新增
        </Button>
      </div>
      <Tabs items={items} onChange={onChange} />
      <Table
        columns={columns}
        dataSource={list}
        pagination={false}
        rowKey="id"
      />

      <ShopCategoryEdit
        cref={shopCategoryEdit}
        onEditFinish={(r) => {
          if (r) getList();
        }}
      />
    </>
  );
}
