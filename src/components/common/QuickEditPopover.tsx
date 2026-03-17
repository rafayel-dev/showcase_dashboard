import React, { useState, useEffect } from "react";
import { Popover, Typography, InputNumber, Space } from "antd";
import { FiEdit } from "react-icons/fi";
import AppButton from "./AppButton";

const { Text } = Typography;

interface QuickEditPopoverProps {
  initialValue: number;
  onSave: (newValue: number) => Promise<void>;
  title: string;
  prefix?: string;
  isStock?: boolean;
}

const QuickEditPopover: React.FC<QuickEditPopoverProps> = ({
  initialValue,
  onSave,
  title,
  prefix = "",
  isStock,
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync value when popover opens or initialValue changes
  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleSave = async () => {
    // Prevent unnecessary API call
    if (value === initialValue) {
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      await onSave(value);
      setOpen(false);
    } catch (err) {
      console.error("QuickEdit save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use live value for better UX
  const isLowStock = !!isStock && value < 5;

  return (
    <Popover
      open={open}
      trigger="click"
      placement="bottom"
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setValue(initialValue); // reset on close
        }
      }}
      title={<Text strong>{title}</Text>}
      content={
        <div className="min-w-[140px] p-1">
          <Space direction="vertical" className="w-full">
            <InputNumber
              min={0}
              value={value}
              autoFocus
              onChange={(v) => {
                setValue(v !== null ? Number(v) : 0);
              }}
              onPressEnter={handleSave}
              className="w-full"
              style={{ width: "100%" }}
            />

            <AppButton
              type="primary"
              size="small"
              className="w-full"
              onClick={handleSave}
              loading={loading}
            >
              Update
            </AppButton>
          </Space>
        </div>
      }
    >
      <div className="cursor-pointer flex items-center justify-center gap-1.5">
        <Text type={isLowStock ? "danger" : undefined}>
          {prefix}
          {value}
        </Text>

       <AppButton
        className="text-violet-600!"
       size="small"
       icon={<FiEdit />}
       onClick={() => setOpen(true)}
       />
      </div>
    </Popover>
  );
};

export default QuickEditPopover;
