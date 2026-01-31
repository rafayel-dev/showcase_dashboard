import React from "react";
import { Spin } from "antd";
import type { SpinProps } from "antd";

const spinnerStyles: SpinProps['styles'] = {
    indicator: {
        color: '#722ed1',
    },
};

const AppSpin: React.FC<SpinProps> = ({ children, ...props }) => {
    if (children) {
        return (
            <Spin styles={spinnerStyles} {...props}>
                {children}
            </Spin>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <Spin size="large" styles={spinnerStyles} {...props} />
        </div>
    );
};

export default AppSpin;
