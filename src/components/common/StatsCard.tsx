import React from "react";
import { Card, Statistic, Typography } from "antd";

const { Text } = Typography;

interface StatsCardProps {
    title: string;
    value: number | string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    icon?: React.ReactNode;
    color?: string;
    note?: string;
    loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    prefix,
    suffix,
    icon,
    color = "bg-blue-100 text-blue-600",
    note,
    loading = false
}) => {
    return (
        <Card className="rounded-2xl shadow-sm transition hover:shadow-md" loading={loading} bordered={false}>
            <div className="flex items-center gap-4">
                {icon && (
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${color}`}>
                        {icon}
                    </div>
                )}
                <div className="flex-1">
                    <Text type="secondary" className="text-sm">
                        {title}
                    </Text>
                    <Statistic
                        className="font-semibold"
                        value={value}
                        prefix={prefix}
                        suffix={suffix}
                        valueStyle={{ fontSize: 22 }}
                    />
                </div>
            </div>
            {note && (
                <Text className="text-xs text-gray-400 mt-2 block">
                    {note}
                </Text>
            )}
        </Card>
    );
};

export default StatsCard;
