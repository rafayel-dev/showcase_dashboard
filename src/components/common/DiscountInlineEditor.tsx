import React, { useState } from "react";
import { DatePicker, Switch, ConfigProvider } from "antd";
import AppSelect from "./AppSelect";
import type { Dayjs } from "dayjs";
import AppButton from "./AppButton";
import AppInput from "./AppInput";

const { RangePicker } = DatePicker;

/**
 * Extended InlineEditor to support advanced Discount editing:
 * - Toggle (Has discount?)
 * - Type (Flat / Percentage)
 * - Value
 * - Date Range
 */
export interface DiscountData {
    hasDiscount: boolean;
    discountType: "flat" | "percentage";
    discountValue: number;
    discountRange?: [Dayjs, Dayjs];
}

interface DiscountInlineEditorProps {
    initialValue: DiscountData;
    onSave: (values: DiscountData) => void;
    onCancel: () => void;
}

const DiscountInlineEditor: React.FC<DiscountInlineEditorProps> = ({
    initialValue,
    onSave,
    onCancel,
}) => {
    const [hasDiscount, setHasDiscount] = useState(initialValue.hasDiscount);
    const [type, setType] = useState<"flat" | "percentage">(initialValue.discountType || "percentage");
    const [val, setVal] = useState<number>(initialValue.discountValue || 0);
    const [range, setRange] = useState<[Dayjs, Dayjs] | undefined>(initialValue.discountRange);

    return (
        <div className="flex flex-col gap-2 p-2 bg-white border border-gray-200 shadow-lg rounded-lg z-50 absolute right-0 min-w-[280px]">
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Active?</span>
                <Switch
                    checked={hasDiscount}
                    onChange={setHasDiscount}
                    size="small"
                    className="bg-gray-300"
                />
            </div>

            {hasDiscount && (
                <>
                    <div className="flex gap-2">
                        <AppSelect
                            value={type}
                            onChange={setType}
                            size="small"
                            className="w-24! text-xs!"
                            options={[
                                { value: "flat", label: "Flat" },
                                { value: "percentage", label: "%" },
                            ]}
                        />
                        <AppInput
                            type="number"
                            size="small"
                            min={0}
                            value={val}
                            onChange={(e) => setVal(Number(e.target.value))}
                            className="w-1/4!"
                            placeholder="Value"
                        />
                    </div>
                    <ConfigProvider theme={{ components: { DatePicker: { cellHeight: 20 } } }}>
                        <RangePicker
                            size="small"
                            value={range}
                            onChange={(dates) => setRange(dates as [Dayjs, Dayjs])}
                            className="w-full"
                        />
                    </ConfigProvider>
                </>
            )}

            <div className="flex justify-end gap-2 mt-1 border-t border-gray-200 pt-2">
                <AppButton size="small" onClick={onCancel}>
                    Cancel
                </AppButton>
                <AppButton
                    type="primary"
                    size="small"
                    onClick={() => onSave({ hasDiscount, discountType: type, discountValue: val, discountRange: range })}
                >
                    Save
                </AppButton>
            </div>
        </div>
    );
};

export default DiscountInlineEditor;
