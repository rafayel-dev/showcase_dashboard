
import { Select, ConfigProvider } from "antd";
import type { SelectProps } from "antd";
import type { BaseOptionType, DefaultOptionType } from "antd/es/select";

const AppSelect = <
    ValueType = any,
    OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType
>({
    className,
    ...props
}: SelectProps<ValueType, OptionType>) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Select: {
                        borderRadius: 8,
                        colorPrimary: "#8b5cf6", // violet-500
                        colorPrimaryHover: "#7c3aed", // violet-600
                        optionSelectedBg: "#ede9fe", // violet-100
                    },
                },
            }}
        >
            <Select
                className={className}
                {...props}
            />
        </ConfigProvider>
    );
};

AppSelect.Option = Select.Option;

export default AppSelect;
