import React from "react";
import { Space, Input, Button, Select } from "antd";

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
    widthClass = "w-20",
    options = [],
}) => (
    <Space>
        <div className="flex flex-col gap-1">
            {type === "select" ? (
                <Select
                    value={value}
                    onChange={onChange}
                    style={{ width: 120 }} // default width, override with className if needed logic
                    options={options}
                    className={`${widthClass}!`}
                />
            ) : (
                <Input
                    type={type}
                    min={type === "number" ? 0 : undefined}
                    value={value}
                    onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
                    className={`${widthClass}!`}
                />
            )}

            <div className="flex gap-1">
                <Button
                    type="primary"
                    size="small"
                    className="bg-violet-500!"
                    onClick={onSave}
                >
                    Save
                </Button>
                <Button danger size="small" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    </Space>
);

export default InlineEditor;
