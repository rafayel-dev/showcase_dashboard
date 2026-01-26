import React from "react";
import { Popconfirm as AntPopconfirm } from "antd";
import type { PopconfirmProps } from "antd";

const AppPopconfirm: React.FC<PopconfirmProps> = ({ okButtonProps, icon, ...props }) => {
    return (
        <AntPopconfirm
            okButtonProps={{ className: "bg-violet-500!", ...okButtonProps }}
            placement="topRight"
            okText="Yes"
            cancelText="No"
            {...props}
        />
    );
};

export default AppPopconfirm;
