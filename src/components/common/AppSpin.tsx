import React from "react";
import { Spin } from "antd";
import type { SpinProps } from "antd";

const AppSpin: React.FC<SpinProps> = ({ children, ...props }) => {
    return (
        <Spin
            wrapperClassName="text-violet-500!"
            {...props}
        >
            {children}
        </Spin>
    );
};

export default AppSpin;
