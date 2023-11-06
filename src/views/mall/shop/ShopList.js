import React, { useEffect, useState, useRef } from "react";
import { getHotel } from "../../../utils/StorageUtils";
import {
  productPage,
  getCategoryList,
  productDelete,
  productSetOnSell,
} from "../../../api/ShopApi";
import {
  Button,
  Table,
  Space,
  Popconfirm,
  Form,
  Input,
  Pagination,
  Switch,
} from "antd";
import { deepCopy } from "../../../utils";
import ShopListEdit from "./ShopListEdit";
// import "./ShopCategoryList.scss";

export default function ShopList() {
  const [datas, setDatas] = useState([]);
  const shopListEdit = useRef();
  const [categoryList, setCategoryList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [size, setSize] = useState("10");
  const [page, setPage] = useState("1");
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [keyword, size, page]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const { data } = await getCategoryList({
      shopId: getHotel().shopId,
    });
    setCategoryList(data);
  };

  const loadData = async () => {
    const { data } = await productPage({
      keyword,
      size,
      page: page - 1,
      shopId: getHotel().shopId,
    });
    setDatas(data);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "库存",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "状态",
      key: "onSell",
      render: (_, record, index) => (
        <Switch
          checkedChildren="已上架"
          unCheckedChildren="未上架"
          checked={record.onSell}
          key={record.id}
          onChange={(checked) => {
            let newData = deepCopy(datas);
            newData.content[index].onSell = checked;
            setDatas(newData);
            productSetOnSell({ id: record.id, onSell: checked });
          }}
        />
      ),
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
              shopListEdit.current.showModel({ ...record });
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="确定删除该条记录吗?"
            onConfirm={() => {
              productDelete({ shopId: getHotel().shopId, id: record.id }).then(
                (res) => {
                  loadData();
                }
              );
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
            shopListEdit.current.showModel({});
          }}
        >
          新增
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={datas.content}
        pagination={false}
        rowKey="id"
      />
      <Pagination
        style={{ marginTop: "10px" }}
        total={datas.totalElements}
        pageSize={size}
        current={page}
        size="small"
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `共 ${total} 条`}
        onChange={(page, pageSize) => {
          setPage(page);
          setSize(pageSize);
        }}
      />
      <ShopListEdit
        cref={shopListEdit}
        categoryList={categoryList}
        onEditFinish={(r) => {
          if (r) loadData();
        }}
      />
    </>
  );
}
