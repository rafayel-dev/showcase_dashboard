import React, { useState } from 'react';
import { Table, Space, Typography, Form, Tooltip, Switch, Upload, Empty } from 'antd';
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { TableProps } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useGetSlidersQuery, useAddSliderMutation, useUpdateSliderMutation, useDeleteSliderMutation } from '../../RTK/slider/sliderApi';
import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import AppModal from "../../components/common/AppModal";
import AppPopconfirm from "../../components/common/AppPopconfirm";
import AppSpin from "../../components/common/AppSpin";
import PageHeader from "../../components/common/PageHeader";
import toast from "../../utils/toast";
import { BASE_URL } from '@/RTK/api';

const { Text } = Typography;

const SliderPage: React.FC = () => {
    const { data: sliders = [], isLoading: tableLoading } = useGetSlidersQuery(undefined);
    const [addSlider, { isLoading: isAdding }] = useAddSliderMutation();
    const [updateSlider, { isLoading: isUpdating }] = useUpdateSliderMutation();
    const [deleteSlider] = useDeleteSliderMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState<any>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    const formLoading = isAdding || isUpdating;

    const handleAdd = () => {
        setEditingSlider(null);
        form.resetFields();
        setFileList([]);
        setModalOpen(true);
    };

    const handleEdit = (record: any) => {
        setEditingSlider(record);
        form.setFieldsValue(record);
        if (record.image) {
            setFileList([
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: record.image.startsWith('http') ? record.image : `${BASE_URL}${record.image}`,
                }
            ]);
        } else {
            setFileList([]);
        }
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSlider(id).unwrap();
            toast.success('Slider deleted successfully');
        } catch (error) {
            toast.error('Failed to delete slider');
        }
    };

    const handleFinish = async () => {
        try {
            const values = await form.validateFields();
            let imageUrl = editingSlider?.image || '';

            if (fileList.length > 0 && fileList[0].originFileObj) {
                const formData = new FormData();
                formData.append('image', fileList[0].originFileObj);

                const res = await fetch(`${BASE_URL}/api/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                imageUrl = data.filePath || data.image;
            }

            if (!imageUrl) {
                toast.error("Image is required");
                return;
            }

            const payload = {
                ...values,
                image: imageUrl,
            };

            if (editingSlider) {
                await updateSlider({ id: editingSlider._id, ...payload }).unwrap();
                toast.success('Slider updated successfully');
            } else {
                await addSlider(payload).unwrap();
                toast.success('Slider added successfully');
            }
            setModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
            toast.error('Action failed');
        }
    };

    const columns: TableProps<any>["columns"] = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => (
                <img
                    src={image?.startsWith('http') ? image : `${BASE_URL}${image}`}
                    alt="Slider"
                    style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }}
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Text strong>{text || '-'}</Text>,
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (link: string) => link ? <a href={link} target="_blank" rel="noreferrer">{link}</a> : '-',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean, record: any) => (
                <Switch
                    checked={isActive}
                    onChange={(checked) => updateSlider({ id: record._id, isActive: checked })}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Edit Slide">
                        <AppButton icon={<FiEdit2 />} onClick={() => handleEdit(record)}>Edit</AppButton>
                    </Tooltip>
                    <AppPopconfirm
                        title="Delete slider?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Delete"
                    >
                        <AppButton danger icon={<FiTrash2 />}>Delete</AppButton>
                    </AppPopconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <AppCard>
                <PageHeader
                    title="Slider Management"
                    subtitle="Manage your home page sliders"
                    actionLabel="Add Slide"
                    actionIcon={<FiPlus />}
                    onAction={handleAdd}
                />

                <AppSpin spinning={tableLoading}>
                    <Table
                        dataSource={sliders}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        locale={{
                            emptyText: <Empty description="No sliders found" />,
                        }}
                    />
                </AppSpin>

                <AppModal
                    title={editingSlider ? "Edit Slide" : "Add Slide"}
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    onOk={handleFinish}
                    confirmLoading={formLoading}
                    okText={editingSlider ? "Update Slide" : "Add Slide"}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="title" label="Title">
                            <AppInput placeholder="Slide Title (Optional)" />
                        </Form.Item>

                        <Form.Item name="link" label="Link URL">
                            <AppInput placeholder="Link (Optional) e.g. /product/123" />
                        </Form.Item>

                        <Form.Item label="Image" required>
                            <Upload
                                accept="image/*"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={({ fileList }) => setFileList(fileList)}
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
                            <Switch />
                        </Form.Item>
                    </Form>
                </AppModal>
            </AppCard>
        </div>
    );
};

export default SliderPage;
