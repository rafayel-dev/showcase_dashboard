import React from "react";
import { Row, Col, Typography, Space } from "antd";
import AppButton from "./AppButton";

const { Title, Text } = Typography;

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: React.ReactNode;
    extraActions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    actionLabel,
    onAction,
    actionIcon,
    extraActions,
}) => {
    return (
        <Row justify="space-between" align="middle" className="mb-6">
            <Col>
                <Title level={3} className="mb-1! text-[#1f2937]!">
                    {title}
                </Title>
                {subtitle && <Text type="secondary">{subtitle}</Text>}
            </Col>
            <Col>
                <Space>
                    {extraActions}
                    {actionLabel && onAction && (
                        <AppButton
                            type="primary"
                            icon={actionIcon}
                            onClick={onAction}
                        >
                            {actionLabel}
                        </AppButton>
                    )}
                </Space>
            </Col>
        </Row>
    );
};

export default PageHeader;
