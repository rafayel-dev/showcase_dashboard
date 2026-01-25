import React from "react";
import { Card as AntCard } from "antd";
import type { CardProps } from "antd";

const AppCard: React.FC<CardProps> = ({ className, children, ...props }) => {
    return (
        <AntCard
            className={`rounded-2xl shadow-sm border-gray-100 ${className || ""}`}
            {...props}
        >
            {children}
        </AntCard>
    );
};

export default AppCard;
