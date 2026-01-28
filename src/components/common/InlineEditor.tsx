import React from "react";
import { Space } from "antd";
import AppSelect from "./AppSelect";
import AppInput from "./AppInput";
import AppButton from "./AppButton";

interface InlineEditorProps {
    type?: "number" | "text" | "select";
    value: string | number;
    onChange: (val: string | number) => void;
    onSave: () => void;
    onCancel: () => void;
    widthClass?: string;
    options?: { value: string; label: string }[];
}

const InlineEditor: React.FC<InlineEditorProps> = ({
    type = "text",
    value,
    onChange,
    onSave,
    onCancel,
    widthClass = "w-16",
    options = [],
}) => (
    <Space>
        <div className="flex flex-col gap-1">
            {type === "select" ? (
                <AppSelect
                    value={value}
                    onChange={onChange}
                    options={options}
                    className={`${widthClass}!`}
                />
            ) : (
                <AppInput
                    type={type}
                    min={type === "number" ? 0 : undefined}
                    value={value}
                    onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
                    className={`${widthClass}!`}
                />
            )}

            <div className="flex gap-1">
                <AppButton
                    type="primary"
                    size="small"
                    className="bg-violet-500!"
                    onClick={onSave}
                >
                    Save
                </AppButton>
                <AppButton danger size="small" onClick={onCancel}>
                    Cancel
                </AppButton>
            </div>
        </div>
    </Space>
);

export default InlineEditor;
