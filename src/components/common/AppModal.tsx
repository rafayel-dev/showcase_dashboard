import React from "react";
import { Modal } from "antd";
import type { ModalProps } from "antd";

const AppModal: React.FC<ModalProps> = ({ okButtonProps, className, style, ...props }) => {
    return (
        <Modal

            destroyOnClose
            maskClosable={false}
            centered
            okButtonProps={{
                className: "bg-violet-500! hover:bg-violet-600! border-violet-500!",
                ...okButtonProps
            }}
            className={`rounded-xl overflow-hidden ${className || ""}`}
            style={{ top: 20, ...style }}
            {...props}
        />
    );
};

export default AppModal;
