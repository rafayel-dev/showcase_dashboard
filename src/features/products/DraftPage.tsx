import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Typography, Row, Col, Tooltip, Empty } from "antd";
import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiUploadCloud } from "react-icons/fi";
import { fetchProducts, updateProduct } from "../../services/productService";
import type { Product } from "../../types";
import toast from "../../utils/toast";

const { Title, Text } = Typography;

const DraftPage: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDraftProducts();
  }, []);

  const loadDraftProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await fetchProducts();
      const draftProducts = allProducts.filter((p) => p.isPublished === false);
      setData(draftProducts);
    } catch {
      toast.error("Failed to load draft products");
    } finally {
      setLoading(false);
    }
  };

  const publishProduct = async (product: Product) => {
    try {
      await updateProduct({ ...product, isPublished: true });
      setData((prev) => prev.filter((p) => p.id !== product.id));
      toast.success(`"${product.productName}" published successfully`);
    } catch {
      toast.error("Failed to publish product");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AppCard className="rounded-2xl">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title level={3} className="mb-0">
              Draft Products
            </Title>
            <Text type="secondary">Products saved but not yet published</Text>
          </Col>
        </Row>

        {/* Table */}
        <Table
          rowKey="id"
          dataSource={data}
          loading={loading}
          pagination={false}
          locale={{
            emptyText: <Empty description="No draft products found" />,
          }}
          columns={[
            {
              title: "Product Name",
              dataIndex: "productName",
              render: (text) => <Text strong>{text}</Text>,
            },
            {
              title: "Status",
              align: "center",
              render: () => <Tag color="orange">Draft</Tag>,
            },
            {
              title: "Actions",
              align: "right",
              render: (_, record) => (
                <Space>
                  <Tooltip title="Edit Product">
                    <AppButton
                      icon={<FiEdit2 />}
                      onClick={() =>
                        navigate(`/dashboard/products/edit/${record.id}`)
                      }
                    >
                      Edit
                    </AppButton>
                  </Tooltip>

                  <Tooltip title="Publish Product">
                    <AppButton
                      type="primary"
                      icon={<FiUploadCloud />}
                      onClick={() => publishProduct(record)}
                    >
                      Publish
                    </AppButton>
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </AppCard>
    </div>
  );
};

export default DraftPage;
