import React from "react";
import { Input } from "antd";
import type { InputProps } from "antd";
import type { TextAreaProps } from "antd/es/input";

const AppInput: React.FC<InputProps> & { TextArea: React.FC<TextAreaProps>; Password: React.FC<InputProps> } = ({ className, ...props }) => {
    return (
        <Input
            className={`rounded-lg hover:border-violet-500! focus:border-violet-500! ${className || ""}`}
            {...props}
        />
    );
};

const AppTextArea: React.FC<TextAreaProps> = ({ className, ...props }) => {
    return (
        <Input.TextArea
            className={`rounded-lg hover:border-violet-500! focus:border-violet-500! ${className || ""}`}
            {...props}
        />
    );
};

const AppPassword: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <Input.Password
            className={`rounded-lg hover:border-violet-500! focus:border-violet-500! ${className || ""}`}
            {...props}
        />
    );
};

AppInput.TextArea = AppTextArea;
AppInput.Password = AppPassword;

export default AppInput;
