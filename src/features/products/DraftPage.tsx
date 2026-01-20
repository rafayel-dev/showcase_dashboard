import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Space, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchProducts, updateProduct } from "../../services/productService";
import type { Product } from "../../types";

const { Title } = Typography;

const DraftPage: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDraftProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await fetchProducts();
        const draftProducts = allProducts.filter(
          (p) => p.isPublished === false
        );
        setData(draftProducts);
      } catch (error) {
        console.error("Failed to fetch draft products:", error);
        // message.error("Failed to load draft products.");
      } finally {
        setLoading(false);
      }
    };
    loadDraftProducts();
  }, []);

  return (
    <Card bordered={false}>
      <Title level={3}>📝 Draft Products</Title>

      <Table
        rowKey="id"
        dataSource={data}
        pagination={false}
        loading={loading}
        columns={[
          {
            title: "Product",
            dataIndex: "title",
          },
          {
            title: "Status",
            render: (_, record) => (
              <Tag color={record.isPublished === false ? "orange" : "green"}>
                {record.isPublished === false ? "Draft" : "Published"}
              </Tag>
            ),
          },
          {
            title: "Action",
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() =>
                    navigate(`/dashboard/products/edit/${record.id}`)
                  }
                >
                  ✏ Edit
                </Button>

                <Button
                  type="primary"
                  onClick={async () => {
                    try {
                      await updateProduct({ ...record, isPublished: true });
                      setData(data.filter((p) => p.id !== record.id));
                      message.success(`Product '${record.title}' published successfully!`);
                    } catch (error) {
                      message.error(`Failed to publish product '${record.title}'.`);
                    }
                  }}
                >
                  🚀 Publish
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default DraftPage;
