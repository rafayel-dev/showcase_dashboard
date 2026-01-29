import React from "react";
import {
  Table,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Tooltip,
  Empty,
} from "antd";
import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiUploadCloud } from "react-icons/fi";
import { useGetProductsQuery, useUpdateProductMutation } from "../../RTK/product/productApi";
import type { Product } from "../../types";
import toast from "../../utils/toast";

const { Title, Text } = Typography;

const DraftPage: React.FC = () => {
  const navigate = useNavigate();
  // Use RTK Query - fetching a reasonably large batch to find drafts, 
  // though backend filtering would be ideal later.
  const { data: productsData, isLoading: loading } = useGetProductsQuery({ page: 1, limit: 100 });

  const products = productsData?.products || [];
  const [updateProduct] = useUpdateProductMutation();

  // Local state for table data not strictly needed unless filtering, 
  // but we can just derive it.
  const draftProducts = products.filter((p) => p.isPublished === false);

  const publishProduct = async (product: Product) => {
    try {
      await updateProduct({ id: product.id, isPublished: true }).unwrap();
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
            <Text type="secondary">
              Products saved but not yet published
            </Text>
          </Col>
        </Row>

        {/* Table */}
        <Table
          rowKey="id"
          dataSource={draftProducts}
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                description="No draft products found"
              />
            ),
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
                        navigate(`/edit-product/${record.id}`)
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
